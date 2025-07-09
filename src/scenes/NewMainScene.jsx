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
      const { scene, freddy } = createDemoScene(gl, VERTEX_SHADER, FRAGMENT_SHADER)
      renderer = initializeRenderer(gl, scene, freddy, scene.mainObj, scene.cylinder2)

      let previousTimestamp
      const frameLoop = timestamp => {
        if (!previousTimestamp) previousTimestamp = timestamp
        const delta = timestamp - previousTimestamp
        renderer.onUpdate(delta)
        previousTimestamp = timestamp
        requestAnimationFrame(frameLoop)
      }
      requestAnimationFrame(frameLoop)
    } catch (e) {
      alert(e.message)
    }

    return () => renderer?.dispose()
  }, [])

  return (
    <article>
      <p>WASD + QE to move, F to spin Freddy</p>
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}></canvas>
    </article>
  )
}

export default NewMainScene
