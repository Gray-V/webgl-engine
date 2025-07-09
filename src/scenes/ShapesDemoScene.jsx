import { useEffect, useRef } from 'react'
import { setupCanvas } from '../engine/canvasSetup.js'
import { createShapesDemoScene } from './shapesDemoScene.js'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const ShapesDemoScene = () => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const gl = setupCanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)
      const { scene, objects } = createShapesDemoScene(gl)
      
      // Animation loop with different rotation speeds for each shape
      let previousTimestamp
      const frameLoop = timestamp => {
        if (!previousTimestamp) previousTimestamp = timestamp
        const delta = timestamp - previousTimestamp
        
        // Rotate each shape at different speeds
        objects.cube.rotate(0.02, 0.01, 0.005)      // Fast X, medium Y, slow Z
        objects.sphere.rotate(0.01, 0.02, 0.01)     // Medium X, fast Y, medium Z
        objects.cylinder.rotate(0.005, 0.005, 0.02) // Slow X, slow Y, fast Z
        objects.pyramid.rotate(0.015, 0.015, 0.015) // Equal speed on all axes
        
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
      <h2>Shapes Factory Demo</h2>
      <p>Showcasing different 3D shapes created with the shapes factory</p>
      <ul>
        <li>Red Cube - Spinning on multiple axes</li>
        <li>Blue Sphere - Smooth rotation</li>
        <li>Green Cylinder - Rotating around Z-axis</li>
        <li>Orange Pyramid - Balanced rotation</li>
        <li>Green Ground - Static reference plane</li>
      </ul>
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}></canvas>
    </article>
  )
}

export default ShapesDemoScene 