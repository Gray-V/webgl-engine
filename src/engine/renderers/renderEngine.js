import { setupMovementControls } from '../../controls/keyboardControls.js'
import { setupMouseLook } from '../../controls/mouseLookControls.js'
import freddy from '../../resources/Cupcake.json'

export function initializeRenderer(gl, scene, options = {}, mainObject, cylinder2) {
  const MILLISECONDS_PER_FRAME = 1000 / (options.fps || 30)
  const freddyRotSpeedDefault = options.defaultRotationSpeed || 0.5
  let freddyRotSpeed = 0
  let freddyIn = true
  let freddyObj = scene.addJSONObj(freddy, [1, 0.5, 0.7])

  let toggleProjectionPressed = false
  let toggleWirePressed = false
  let toggleLightingPressed = false
  let toggleRPressed = false
  let wireFrameEnabled = false

  // Bounce state for sphere2
  let bounceActive = false
  let bounceTime = 0
  const bounceDuration = 1000 // milliseconds
  const bounceHeight = 20
  const sphere2 = mainObject

  // Tipping state for cylinder2
  let tippingActive = false
  let tippingTime = 0
  const tippingDuration = 1000 // milliseconds
  let cylinderTipped = false
  const cylinder = cylinder2

  const controls = setupMovementControls(scene, options.movementSpeed || 1, keysDown => {
    if (keysDown.has('f')) freddyRotSpeed = freddyRotSpeedDefault

    if (keysDown.has('p') && !toggleProjectionPressed) {
      toggleProjectionPressed = true
      const usePerspective = !scene.perspective
      scene.setProjection(usePerspective)
    } else if (!keysDown.has('p')) {
      toggleProjectionPressed = false
    }

    if (keysDown.has('t') && !toggleWirePressed) {
      toggleWirePressed = true
      wireFrameEnabled = !wireFrameEnabled
      scene.toggleWireframe()
    } else if (!keysDown.has('t')) {
      toggleWirePressed = false
    }

    if (keysDown.has('l') && !toggleLightingPressed) {
      toggleLightingPressed = true
      scene.toggleShadingMode()
      scene.render()
    } else if (!keysDown.has('l')) {
      toggleLightingPressed = false
    }

    if (keysDown.has('r') && !toggleRPressed) {
      toggleRPressed = true
      if (freddyIn) {
        scene.remove(freddyObj)
        freddyIn = false
      } else {
        freddyObj = scene.addJSONObj(freddy, [1, 0.5, 0.7])
        freddyIn = true
      }
      scene.render()
    } else if (!keysDown.has('r')) {
      toggleRPressed = false
    }

    if (keysDown.has('c')) {
      tippingActive = true
      tippingTime = 0
      cylinderTipped = !cylinderTipped // Toggle tipping state
    }

    // SPACEBAR starts bounce
    if (keysDown.has(' ')) {
      bounceActive = true
      bounceTime = 0
    }
  })

  const mouseLook = setupMouseLook(scene.activeCamera, {
    sensitivity: 0.003,
    canvas: gl.canvas
  })

  let currentTime = 0
  let nextRenderTime = 0

  function onUpdate(deltaTime) {
    currentTime += deltaTime
    if (currentTime >= nextRenderTime) {
      freddyRotSpeed = 0
      controls.applyMovement()
      nextRenderTime = currentTime + MILLISECONDS_PER_FRAME

      // Bounce logic for sphere2
      if (bounceActive && sphere2) {
        bounceTime += deltaTime
        const t = bounceTime / bounceDuration
        const y = bounceHeight * Math.sin(Math.PI * t)
        sphere2.setPosition([0, 45, y])
        if (bounceTime >= bounceDuration) {
          bounceActive = false
          sphere2.setPosition([0, 45, 1])
        }
      }

      // Tipping logic for cylinder2 (exact 90° rotation)

      if (tippingActive && cylinder) {
        tippingTime += deltaTime
        const t = Math.min(tippingTime / tippingDuration, 1)

        // Determine the target angle (90° or 0°)
        const targetAngle = cylinderTipped ? 0 : Math.PI / 2
        const currentRotation = cylinder.rotation ? cylinder.rotation[0] : 0
        const newRotation = currentRotation * (1 - t) + targetAngle * t

        console.log('Cylinder2 Target:', targetAngle, 'Current:', currentRotation, 'New:', newRotation)

        // Apply the rotation only on the X-axis (tipping)
        cylinder.setRotation([newRotation, 0, 0])

        // End tipping when complete
        if (t >= 1) {
          tippingActive = false
          cylinderTipped = !cylinderTipped // Toggle state
        }
      }
      scene.render()
      options.rotate(0, -freddyRotSpeed, 0)
    }
  }

  return {
    onUpdate,
    dispose: () => {
      controls.dispose()
      mouseLook.dispose()
    }
  }
}
