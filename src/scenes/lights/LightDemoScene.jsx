import React, { useEffect, useRef, useState } from 'react'
import { setupCanvas } from '../../engine/webgl/canvasSetup.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../../engine/shaders/index.js'
import Scene from '../../engine/scene.js'
import { Shapes } from '../../engine/geometry/shapes.js'
import { createCubeVerticesWithNormals } from '../../engine/geometry/cube.js'
import meshData from '../../engine/mesh/meshData.js'
import object from '../../engine/objects/object.js'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const LightDemoScene = () => {
  const canvasRef = useRef()
  const [lightIntensity, setLightIntensity] = useState(1.0)
  const [lightDirection, setLightDirection] = useState([-1, 1, -1])
  const [showNormals, setShowNormals] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animationId
    try {
      const gl = setupCanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)
      const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER, true)

      // Only add the blue (smooth) cube
      const { positions, normals } = createCubeVerticesWithNormals(80, 80, 80)
      const smoothCubeMesh = new meshData(positions, null, [0.3, 0.3, 0.8])
      smoothCubeMesh.normals = normals // override with explicit normals
      const smoothCube = new object(smoothCubeMesh, [0, 0, -200], [0, 0, 0], [1, 1, 1])
      scene.add(smoothCube)

      const sphere = Shapes.sphere(60, 16, 16, [150, 0, -200], [0, 0, 0], [1, 1, 1], [0.3, 0.8, 0.3])
      scene.add(sphere)

      const cylinder = Shapes.cylinder(40, 120, 16, [-150, 0, -200], [0, 0, 0], [1, 1, 1], [0.3, 0.3, 0.8])
      scene.add(cylinder)

      // Add ground plane for better lighting demonstration
      const ground = Shapes.ground(600, [0, -150, 0], [0.4, 0.4, 0.4])
      scene.add(ground)

      // Configure directional light
      scene.lights = {
        directional: {
          direction: lightDirection,
          color: [1.0, 1.0, 1.0], // White light
          intensity: lightIntensity
        },
        pointLights: []
      }

      // Override the lighting uniforms update to use our state
      scene.updateLightingUniforms = function() {
        const gl = this.gl
        gl.uniform3fv(this.lightDirectionLoc, [lightDirection[0], lightDirection[1], -lightDirection[2]])
        gl.uniform3fv(this.lightColorLoc, [1.0 * lightIntensity, 1.0 * lightIntensity, 1.0 * lightIntensity])
        gl.uniform3fv(this.ambientColorLoc, [0.2, 0.2, 0.2]) // Reduced ambient for better directional light effect
        gl.uniform3fv(this.lightPositionsLoc, new Array(12).fill(0))
        gl.uniform3fv(this.lightColorsLoc, new Array(12).fill(0))
        gl.uniform1i(this.numLightsLoc, 0)
        gl.uniform1f(this.shininessLoc, this.material.shininess)
        gl.uniform1f(this.metallicLoc, this.material.metallic)
        gl.uniform1f(this.roughnessLoc, this.material.roughness)
      }

      // Set show normals for all objects
      scene.objects.forEach(obj => {
        if (obj.meshData) {
          obj.meshData.showNormals = showNormals
        }
      })

      // Animation loop
      const animate = () => {
        // Rotate all objects only around Y-axis for uniform rotation
        smoothCube.rotate(0, 0.02, 0) // Only Y-axis rotation
        sphere.rotate(0, 0.02, 0)    // Only Y-axis rotation  
        cylinder.rotate(0, 0.02, 0)  // Only Y-axis rotation
        scene.render()
        animationId = requestAnimationFrame(animate)
      }
      animate()
    } catch (e) {
      console.error('Error initializing light demo:', e)
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [lightIntensity, lightDirection, showNormals])

  const handleIntensityChange = (e) => {
    setLightIntensity(parseFloat(e.target.value))
  }

  const handleDirectionChange = (axis, value) => {
    const newDirection = [...lightDirection]
    newDirection[axis] = parseFloat(value)
    setLightDirection(newDirection)
  }

  return (
    <article>
      <h2>Directional Light Demo Scene</h2>
      <p>Demonstrating directional lighting with multiple objects and interactive controls.</p>
      
      <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Light Controls</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Light Intensity: {lightIntensity.toFixed(2)}
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={lightIntensity}
                onChange={handleIntensityChange}
                style={{ width: '100%', marginTop: '5px' }}
              />
            </label>
          </div>
          
          <div>
            <h4>Light Direction:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <label>
                X: {lightDirection[0].toFixed(2)}
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={lightDirection[0]}
                  onChange={(e) => handleDirectionChange(0, e.target.value)}
                  style={{ width: '100%' }}
                />
              </label>
              <label>
                Y: {lightDirection[1].toFixed(2)}
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={lightDirection[1]}
                  onChange={(e) => handleDirectionChange(1, e.target.value)}
                  style={{ width: '100%' }}
                />
              </label>
              <label>
                Z: {lightDirection[2].toFixed(2)}
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={lightDirection[2]}
                  onChange={(e) => handleDirectionChange(2, e.target.value)}
                  style={{ width: '100%' }}
                />
              </label>
            </div>
          </div>
          
          <div style={{ marginTop: '10px' }}>
            <label>
              <input
                type="checkbox"
                checked={showNormals}
                onChange={(e) => setShowNormals(e.target.checked)}
              />
              <span style={{ marginLeft: '5px' }}>Show Normals (Debug)</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3>Scene Objects</h3>
          <ul>
            <li><strong>Smooth Cube:</strong> Semi-metallic material</li>
            <li><strong>Green Sphere:</strong> Smooth surface with high shininess</li>
            <li><strong>Blue Cylinder:</strong> Highly metallic and reflective</li>
            <li><strong>Gray Ground:</strong> Matte reference surface</li>
          </ul>
          
          <h3>Lighting Effects</h3>
          <ul>
            <li><strong>Directional Light:</strong> Simulates sunlight from a specific direction</li>
            <li><strong>Specular Highlights:</strong> Visible on shiny surfaces</li>
            <li><strong>Shadows:</strong> Areas facing away from light appear darker</li>
            <li><strong>Material Response:</strong> Different materials react differently to light</li>
          </ul>
        </div>
      </div>

      <canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={canvasRef}
        style={{
          border: '2px solid #333',
          borderRadius: '5px',
          display: 'block',
          margin: '0 auto',
          background: '#222'
        }}
      />
      <div style={{textAlign: 'center', marginTop: 8}}>
        <span style={{color: '#36c', fontWeight: 600}}>Smooth Cube (Per-Vertex Normals)</span>
      </div>
    </article>
  )
}

export default LightDemoScene
