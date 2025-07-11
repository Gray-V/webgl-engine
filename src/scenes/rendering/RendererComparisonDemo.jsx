import { useEffect, useRef, useState } from 'react'
import { setupCanvas } from '../../engine/webgl/canvasSetup.js'
import { createShapesDemoScene } from '../shapes/shapesDemoScene.js'
import { ForwardRenderer } from '../../engine/renderers/ForwardRenderer.js'
import { DeferredRenderer } from '../../engine/renderers/DeferredRenderer.js'
import { RendererFactory } from '../../engine/renderers/RendererFactory.js'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 300

const RendererComparisonDemo = () => {
  const forwardCanvasRef = useRef()
  const deferredCanvasRef = useRef()
  const [forwardStats, setForwardStats] = useState({})
  const [deferredStats, setDeferredStats] = useState({})
  const [rendererInfo, setRendererInfo] = useState({})
  const [selectedRenderer, setSelectedRenderer] = useState('both')

  useEffect(() => {
    const forwardCanvas = forwardCanvasRef.current
    const deferredCanvas = deferredCanvasRef.current
    if (!forwardCanvas || !deferredCanvas) return

    let forwardRenderer
    let deferredRenderer
    let animationId

    try {
      // Set up forward renderer
      const forwardGl = setupCanvas(forwardCanvas, CANVAS_WIDTH, CANVAS_HEIGHT)
      const forwardScene = createShapesDemoScene(forwardGl).scene
      forwardRenderer = new ForwardRenderer(forwardGl, forwardScene)
      forwardRenderer.initialize()

      // Set up deferred renderer
      const deferredGl = setupCanvas(deferredCanvas, CANVAS_WIDTH, CANVAS_HEIGHT)
      const deferredScene = createShapesDemoScene(deferredGl).scene
      deferredRenderer = new DeferredRenderer(deferredGl, deferredScene)
      deferredRenderer.initialize()

      // Get renderer information
      const info = RendererFactory.getRendererInfo(forwardScene)
      setRendererInfo(info)

      // Animation loop
      let previousTimestamp
      const frameLoop = timestamp => {
        if (!previousTimestamp) previousTimestamp = timestamp
        const delta = timestamp - previousTimestamp

        // Rotate objects in both scenes
        forwardScene.objects.forEach((obj, index) => {
          const speed = 0.01 + (index % 3) * 0.005
          obj.rotate(speed, speed * 0.7, speed * 0.3)
        })

        deferredScene.objects.forEach((obj, index) => {
          const speed = 0.01 + (index % 3) * 0.005
          obj.rotate(speed, speed * 0.7, speed * 0.3)
        })

        // Render based on selection
        if (selectedRenderer === 'forward' || selectedRenderer === 'both') {
          forwardRenderer.render()
          setForwardStats(forwardRenderer.getStats())
        }

        if (selectedRenderer === 'deferred' || selectedRenderer === 'both') {
          deferredRenderer.render()
          setDeferredStats(deferredRenderer.getStats())
        }

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
      if (forwardRenderer) {
        forwardRenderer.dispose()
      }
      if (deferredRenderer) {
        deferredRenderer.dispose()
      }
    }
  }, [selectedRenderer])

  return (
    <article>
      <h2>Renderer Comparison Demo</h2>
      <p>Compare Forward and Deferred rendering approaches with the same scene.</p>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Renderer Selection:</strong>
          <select 
            value={selectedRenderer} 
            onChange={(e) => setSelectedRenderer(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="both">Both Renderers</option>
            <option value="forward">Forward Only</option>
            <option value="deferred">Deferred Only</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h3>Scene Statistics</h3>
          <ul>
            <li>Objects: {rendererInfo.sceneStats?.objects || 0}</li>
            <li>Lights: {rendererInfo.sceneStats?.lights || 0}</li>
            <li>Auto-detected: {rendererInfo.autoDetected || 'forward'}</li>
          </ul>
        </div>

        <div>
          <h3>Performance Comparison</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Metric</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Forward</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Deferred</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Draw Calls</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{forwardStats.drawCalls || 0}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{deferredStats.drawCalls || 0}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Triangles</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{forwardStats.triangles || 0}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{deferredStats.triangles || 0}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Objects</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{forwardStats.objects || 0}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{deferredStats.objects || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Forward Renderer</h3>
          <canvas 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
            ref={forwardCanvasRef}
            style={{ 
              border: selectedRenderer === 'forward' || selectedRenderer === 'both' ? '2px solid #4CAF50' : '2px solid #ccc',
              borderRadius: '5px'
            }}
          ></canvas>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Traditional approach - direct rendering with per-fragment lighting
          </p>
        </div>

        <div>
          <h3>Deferred Renderer</h3>
          <canvas 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
            ref={deferredCanvasRef}
            style={{ 
              border: selectedRenderer === 'deferred' || selectedRenderer === 'both' ? '2px solid #2196F3' : '2px solid #ccc',
              borderRadius: '5px'
            }}
          ></canvas>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Modern approach - G-buffer pass + lighting pass
          </p>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <h3>Key Differences</h3>
        <ul>
          <li><strong>Forward:</strong> Each object is rendered once with all lighting calculated per-fragment</li>
          <li><strong>Deferred:</strong> Objects are rendered to G-buffer first, then lighting is applied in a separate pass</li>
          <li><strong>Memory:</strong> Deferred uses more memory for G-buffer textures but scales better with lights</li>
          <li><strong>Performance:</strong> Forward is faster for simple scenes, Deferred scales better with complexity</li>
        </ul>
      </div>
    </article>
  )
}

export default RendererComparisonDemo 