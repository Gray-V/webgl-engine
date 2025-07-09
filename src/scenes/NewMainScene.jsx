import { useEffect, useRef } from 'react'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../engine/helpers.js'
import { createDemoScene } from './demoScene.js'
import { setupCanvas } from '../engine/canvasSetup.js'
import { initializeRenderer } from '../engine/renderEngine.js'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const NewMainScene = () => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer

    try {
      const gl = setupCanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)
      const { scene, cube, mainObj, cylinder2 } = createDemoScene(gl)
      
      // Create a simple renderer that just spins the cube
      const rotationSpeed = 0.02 // radians per frame
      
      let previousTimestamp
      const frameLoop = timestamp => {
        if (!previousTimestamp) previousTimestamp = timestamp
        const delta = timestamp - previousTimestamp
        
        // Rotate the cube
        cube.rotate(rotationSpeed, rotationSpeed * 0.5, rotationSpeed * 0.3)
        
        // Render the scene
        scene.render()
        
        previousTimestamp = timestamp
        requestAnimationFrame(frameLoop)
      }
      requestAnimationFrame(frameLoop)
    } catch (e) {
      alert(e.message)
    }

    return () => {
      // Cleanup if needed
    }
  }, [])

  return (
    <article>
      <p>Spinning Cube Demo</p>
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}></canvas>
    </article>
  )
}

export default NewMainScene
