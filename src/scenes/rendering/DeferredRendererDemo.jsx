import { useEffect, useRef, useState } from 'react'
import { setupCanvas } from '../../engine/webgl/canvasSetup.js'
import { createDeferredRendererDemo } from './DeferredRendererDemo.js'
import { DeferredRenderer } from '../../engine/renderers/DeferredRenderer.js'
import { RendererFactory } from '../../engine/renderers/RendererFactory.js'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const DeferredRendererDemo = () => {
  const canvasRef = useRef()
  const [stats, setStats] = useState({})
  const [rendererInfo, setRendererInfo] = useState({})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer
    let animationId

    try {
      const gl = setupCanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT)
      const { scene, objects } = createDeferredRendererDemo(gl)
      
      // Create deferred renderer
      renderer = new DeferredRenderer(gl, scene)
      renderer.initialize()
      
      // Get renderer information
      const info = RendererFactory.getRendererInfo(scene)
      setRendererInfo(info)
      
      // Animation loop
      let previousTimestamp
      const frameLoop = timestamp => {
        if (!previousTimestamp) previousTimestamp = timestamp
        const delta = timestamp - previousTimestamp
        
        // Rotate objects at different speeds
        objects.forEach((obj, index) => {
          const speed = 0.008 + (index % 4) * 0.003
          obj.rotate(speed, speed * 0.6, speed * 0.4)
        })
        
        // Render the scene
        renderer.render()
        
        // Update stats
        setStats(renderer.getStats())
        
        previousTimestamp = timestamp
        animationId = requestAnimationFrame(frameLoop)
      }
      animationId = requestAnimationFrame(frameLoop)
    } catch (e) {
      alert(e.message)
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (renderer) {
        renderer.dispose()
      }
    }
  }, [])

  return (
    <article>
      <h2>Deferred Renderer Demo</h2>
      <p>Modern rendering approach - geometry data is first rendered to G-buffer textures, then lighting is applied in a second pass.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h3>Scene Statistics</h3>
          <ul>
            <li>Objects: {rendererInfo.sceneStats?.objects || 0}</li>
            <li>Lights: {rendererInfo.sceneStats?.lights || 0}</li>
            <li>Renderer Type: {rendererInfo.autoDetected || 'deferred'}</li>
          </ul>
        </div>
        
        <div>
          <h3>Performance Stats</h3>
          <ul>
            <li>Draw Calls: {stats.drawCalls || 0}</li>
            <li>Triangles: {stats.triangles || 0}</li>
            <li>Objects Rendered: {stats.objects || 0}</li>
          </ul>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h3>Deferred Rendering Pros</h3>
          <ul style={{ color: '#4CAF50' }}>
            {rendererInfo.recommendations?.deferred?.pros?.map((pro, index) => (
              <li key={index}>{pro}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3>Deferred Rendering Cons</h3>
          <ul style={{ color: '#f44336' }}>
            {rendererInfo.recommendations?.deferred?.cons?.map((con, index) => (
              <li key={index}>{con}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>How Deferred Rendering Works</h3>
        <ol>
          <li><strong>Geometry Pass:</strong> Render all objects to G-buffer textures (albedo, normal, position, material)</li>
          <li><strong>Lighting Pass:</strong> Apply all lights using the G-buffer data in a single full-screen quad</li>
          <li><strong>Result:</strong> Complex lighting with many lights becomes efficient</li>
        </ol>
      </div>

      <p><strong>Best for:</strong> Scenes with many objects and lights, complex lighting requirements, post-processing effects needed</p>
      
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}></canvas>
    </article>
  )
}

export default DeferredRendererDemo 