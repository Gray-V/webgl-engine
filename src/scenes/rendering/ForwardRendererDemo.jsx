import { useEffect, useRef, useState } from 'react'
import { setupCanvas } from '../../engine/canvasSetup.js'
import { createForwardRendererDemo } from './ForwardRendererDemo.js'
import { ForwardRenderer } from '../../engine/renderers/ForwardRenderer.js'
import { RendererFactory } from '../../engine/renderers/RendererFactory.js'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const ForwardRendererDemo = () => {
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
      const { scene, objects } = createForwardRendererDemo(gl)
      
      // Create forward renderer
      renderer = new ForwardRenderer(gl, scene)
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
          const speed = 0.01 + (index % 3) * 0.005
          obj.rotate(speed, speed * 0.7, speed * 0.3)
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
      <h2>Forward Renderer Demo</h2>
      <p>Traditional rendering approach - objects are rendered directly to screen with lighting calculated per-fragment.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h3>Scene Statistics</h3>
          <ul>
            <li>Objects: {rendererInfo.sceneStats?.objects || 0}</li>
            <li>Lights: {rendererInfo.sceneStats?.lights || 0}</li>
            <li>Renderer Type: {rendererInfo.autoDetected || 'forward'}</li>
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
          <h3>Forward Rendering Pros</h3>
          <ul style={{ color: '#4CAF50' }}>
            {rendererInfo.recommendations?.forward?.pros?.map((pro, index) => (
              <li key={index}>{pro}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3>Forward Rendering Cons</h3>
          <ul style={{ color: '#f44336' }}>
            {rendererInfo.recommendations?.forward?.cons?.map((con, index) => (
              <li key={index}>{con}</li>
            ))}
          </ul>
        </div>
      </div>

      <p><strong>Best for:</strong> Scenes with few objects and lights, simple lighting requirements, transparency support needed</p>
      
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}></canvas>
    </article>
  )
}

export default ForwardRendererDemo 