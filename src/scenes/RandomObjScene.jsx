import { useEffect, useRef, useState } from 'react'
import { createDemoScene } from './sandboxScene.js'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 800
const FRAMES_PER_SECOND = 30
const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

const GetTitleMessage = ({ message }) => <p>{message}</p>

const MainScene = () => {
  const canvasRef = useRef()
  const [titleMessage, setTitleMessage] = useState('Use keys 1-3 to switch cameras!')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) {
      alert('No WebGL context found.')
      return
    }

    gl.viewport(0, 0, canvas.width, canvas.height)

    const { scene, cameras, freddy, fanBase, fanBlade, sphere, cylinder } = createDemoScene(gl)

    const switchToCamera = cam => {
      scene.setActiveCamera(cam)
    }

    const keyDownHandler = e => {
      switch (e.key) {
        case '1':
          switchToCamera(cameras.cameraMain)
          setTitleMessage('Main Camera')
          break
        case '2':
          switchToCamera(cameras.cameraFan)
          setTitleMessage('Looking at Fan')
          break
        case '3':
          switchToCamera(cameras.cameraFreddy)
          setTitleMessage('Looking at Freddy')
          break
        case '0':
          scene.setCameraTarget(0, 0, 0)
          setTitleMessage('Reset View')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', keyDownHandler)

    // Animation loop
    let currentTime = 0
    let nextRenderTime = 0
    let previousTimestamp

    const onUpdate = deltaTime => {
      currentTime += deltaTime
      if (currentTime >= nextRenderTime) {
        nextRenderTime = currentTime + MILLISECONDS_PER_FRAME
        scene.render()

        const r = 0.05
        freddy.rotate(0, -r, 0)
        fanBase.rotate(0, 0, -r)
        fanBlade.rotate(0, r, -r * 8)
        sphere.rotate(r, r / 3, r / 9)
        cylinder.rotate(r, r, r / 3)
      }
    }

    const nextFrame = timestamp => {
      if (!previousTimestamp) {
        previousTimestamp = timestamp
        window.requestAnimationFrame(nextFrame)
        return
      }

      const progress = timestamp - previousTimestamp
      if (progress >= MILLISECONDS_PER_FRAME) {
        onUpdate(progress)
        previousTimestamp = timestamp
      }

      window.requestAnimationFrame(nextFrame)
    }

    window.requestAnimationFrame(nextFrame)

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  return (
    <article>
      <GetTitleMessage message={titleMessage} />
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}></canvas>
    </article>
  )
}

export default MainScene
