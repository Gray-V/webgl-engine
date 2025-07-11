import { useEffect, useRef } from 'react'
import { setupCanvas } from '../../engine/canvasSetup.js'
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
        objects.metallicSphere.rotate(0.025, 0.025, 0.025) // Fast rotation for metallic effect
        objects.glassSphere.rotate(0.03, 0.02, 0.01) // Very fast for glass effect
        
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
      <h2>Enhanced Shapes Factory Demo</h2>
      <p>Showcasing 3D shapes with improved lighting, materials, and visual effects</p>
      <ul>
        <li>Red Cube - Semi-metallic with medium shininess</li>
        <li>Blue Sphere - Smooth with high shininess</li>
        <li>Green Cylinder - Highly metallic and shiny</li>
        <li>Orange Pyramid - Matte surface with low shininess</li>
        <li>Gold Metallic Sphere - Highly reflective metallic material</li>
        <li>Glass Sphere - Ultra-smooth with maximum shininess</li>
        <li>Green Ground - Matte reference plane</li>
      </ul>
      <p><strong>Features:</strong> Multiple light sources, specular highlights, rim lighting, gamma correction, and per-object materials</p>
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}></canvas>
    </article>
  )
}

export default ShapesDemoScene 