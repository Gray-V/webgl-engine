import { v3 } from '../engine/matrix.js'

export function setupMouseLook(camera, options = {}) {
  const sensitivity = options.sensitivity || 0.002
  const pitchClamp = Math.PI / 2 - 0.01

  let dragging = false
  let lastX = 0
  let lastY = 0

  let yaw = 0
  let pitch = 0

  function updateCamera() {
    const dir = [
      Math.sin(yaw) * Math.cos(pitch),   // X - left/right
      Math.sin(pitch),                   // Y - up/down
      Math.cos(yaw) * Math.cos(pitch)    // Z - forward/back
    ]

    const eye = camera.position
    const target = [
      eye[0] + dir[0],
      eye[1] + dir[1],
      eye[2] + dir[2]
    ]

    camera.lookAt(...target)
  }

  function onMouseDown(e) {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
  }

  function onMouseUp() {
    dragging = false
  }

  function onMouseMove(e) {
    if (!dragging) return

    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY

    yaw -= dx * sensitivity   // Horizontal: look left/right
    pitch -= dy * sensitivity // Vertical: look up/down

    pitch = Math.max(-pitchClamp, Math.min(pitchClamp, pitch))

    updateCamera()
  }

  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('mousemove', onMouseMove)

  return {
    dispose() {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }
}
