import React, { useEffect, useRef } from 'react'
import { setupCanvas } from '../../engine/webgl/canvasSetup.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../../engine/shaders/index.js'
import Scene from '../../engine/scene.js'
import { Shapes } from '../../engine/geometry/shapes.js'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const LightDemoScene = () => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animationId
    try {
      const gl = setupCanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)
      const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER, true)


      const cube = Shapes.cube(100, [0, 0, -200], [0, 0, 0], [1, 1, 1], [0.8, 0.3, 0.3])
      scene.add(cube)

      scene.lights = {
        directional: {
          direction: [0, 1, 0], 
          color: [0, 0, 0],    
          intensity: 0.0
        },
        pointLights: []
      }
      // Set ambient 
      scene.updateLightingUniforms = function() {
        const gl = this.gl
        gl.uniform3fv(this.lightDirectionLoc, [0, 1, 0])
        gl.uniform3fv(this.lightColorLoc, [0, 0, 0])
        gl.uniform3fv(this.ambientColorLoc, [0.5, 0.5, 0.5])
        gl.uniform3fv(this.lightPositionsLoc, new Array(12).fill(0))
        gl.uniform3fv(this.lightColorsLoc, new Array(12).fill(0))
        gl.uniform1i(this.numLightsLoc, 0)
        gl.uniform1f(this.shininessLoc, this.material.shininess)
        gl.uniform1f(this.metallicLoc, this.material.metallic)
        gl.uniform1f(this.roughnessLoc, this.material.roughness)
      }

      // Animation loop
      const animate = () => {
        cube.rotate(0.01, 0.02, 0.015)
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
  }, [])

  return (
    <article>
      <h2>Basic Light Demo Scene</h2>
      <p>A single spinning object with basic lighting.</p>
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
    </article>
  )
}

export default LightDemoScene
