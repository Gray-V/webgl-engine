import { m4 } from '../engine/math/matrix.js'

export function setupMovementControls(scene, cameraSpeed = 1, onCustomKeys = () => {}) {
  const keysDown = new Set()

  function handleKeyDown(e) {
    keysDown.add(e.key)
  }

  function handleKeyUp(e) {
    keysDown.delete(e.key)
  }

  function applyMovement() {
    keysDown.forEach((key) => {
      switch (key) {
        case 'a':
          scene.sceneTransform = m4.translate(scene.sceneTransform, -cameraSpeed, 0, 0); break
        case 'd':
          scene.sceneTransform = m4.translate(scene.sceneTransform, cameraSpeed, 0, 0); break
        case 's':
          scene.sceneTransform = m4.translate(scene.sceneTransform, 0, cameraSpeed, 0); break
        case 'w':
          scene.sceneTransform = m4.translate(scene.sceneTransform, 0, -cameraSpeed, 0); break
        case 'e':
          scene.sceneTransform = m4.translate(scene.sceneTransform, 0, 0, cameraSpeed); break
        case 'q':
          scene.sceneTransform = m4.translate(scene.sceneTransform, 0, 0, -cameraSpeed); break
      }
    })
    onCustomKeys(keysDown)
  }

  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  return {
    applyMovement,
    dispose: () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }
}
