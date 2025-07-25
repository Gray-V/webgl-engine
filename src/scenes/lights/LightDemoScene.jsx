import React, { useEffect, useRef, useState } from 'react'
import { setupCanvas } from '../../engine/webgl/canvasSetup.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../../engine/shaders/index.js'
import Scene from '../../engine/scene.js'
import { Shapes } from '../../engine/geometry/shapes.js'
import meshMaker from '../../engine/mesh/meshMaker.js'
import {m4,v3} from '../../engine/math/matrix.js'

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

 
      const flatCube = Shapes.cube(100, [0, 0, -200], [0, 0, 0], [1, 1, 1], [0.3, 0.3, 0.8])
      flatCube.material = { shininess: 32, metallic: 0.1, roughness: 0.3 }
      // scene.add(flatCube)

      const sphere = Shapes.sphere(60, 16, 16, [150, 0, -200], [0, 0, 0], [1, 1, 1], [0.3, 0.8, 0.3])
      scene.add(sphere)

      const cylinder = Shapes.cylinder(40, 120, 16, [-150, 0, -200], [0, 0, 0], [1, 1, 1], [0.3, 0.3, 0.8])
      scene.add(cylinder)

      const ground = Shapes.ground(600, [0, -150, 0], [0.4, 0.4, 0.4])
      scene.add(ground)

      scene.lights = {
        directional: {
          direction: lightDirection,
          color: [1.0, 1.0, 1.0],
          intensity: lightIntensity
        },
        pointLights: []
      }

      scene.updateLightingUniforms = function () {
        const gl = this.gl
        gl.uniform3fv(this.lightDirectionLoc, [lightDirection[0], lightDirection[1], -lightDirection[2]])
        gl.uniform3fv(this.lightColorLoc, [1.0 * lightIntensity, 1.0 * lightIntensity, 1.0 * lightIntensity])
        gl.uniform3fv(this.ambientColorLoc, [0.2, 0.2, 0.2])
        gl.uniform3fv(this.lightPositionsLoc, new Array(12).fill(0))
        gl.uniform3fv(this.lightColorsLoc, new Array(12).fill(0))
        gl.uniform1i(this.numLightsLoc, 0)
        gl.uniform1f(this.shininessLoc, this.material.shininess)
        gl.uniform1f(this.metallicLoc, this.material.metallic)
        gl.uniform1f(this.roughnessLoc, this.material.roughness)
      }

      scene.objects.forEach(obj => {
        if (obj.meshData) {
          obj.meshData.showNormals = showNormals
        }
      })

      const animate = () => {
        flatCube.rotate(0, 0.02, 0)
        sphere.rotate(0, 0.02, 0)
        cylinder.rotate(0, 0.02, 0)
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
      <p>Demonstrating lighting with fixed-face cube normals (flat shading), spheres, and cylinders.</p>

      <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Light Controls</h3>
          <label>
            Light Intensity: {lightIntensity.toFixed(2)}
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={lightIntensity}
              onChange={handleIntensityChange}
              style={{ width: '100%' }}
            />
          </label>

          <h4>Light Direction</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {['X', 'Y', 'Z'].map((label, i) => (
              <label key={label}>
                {label}: {lightDirection[i].toFixed(2)}
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={lightDirection[i]}
                  onChange={(e) => handleDirectionChange(i, e.target.value)}
                  style={{ width: '100%' }}
                />
              </label>
            ))}
          </div>

          <label style={{ display: 'block', marginTop: '10px' }}>
            <input
              type="checkbox"
              checked={showNormals}
              onChange={(e) => setShowNormals(e.target.checked)}
            />
            <span style={{ marginLeft: '5px' }}>Show Normals (Debug)</span>
          </label>
        </div>

        <div>
          <h3>Scene Objects</h3>
          <ul>
            <li><strong>Flat Cube:</strong> Flat shaded with correct face normals</li>
            <li><strong>Green Sphere:</strong> Smooth normal interpolation</li>
            <li><strong>Blue Cylinder:</strong> Curved, semi-metallic</li>
            <li><strong>Ground Plane:</strong> Matte reference</li>
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
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <span style={{ color: '#36c', fontWeight: 600 }}>Flat Shaded Cube with Lighting</span>
      </div>
    </article>
  )
}

export default LightDemoScene
