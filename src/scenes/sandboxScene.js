import Scene from '../engine/scene.js'
import meshMaker from '../engine/meshMaker.js'
import Camera from '../engine/camera.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../engine/helpers.js'

export function createDemoScene(gl) {
  const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER, true)

  const freddy = meshMaker.customFreddyObject()
  const fanBase = meshMaker.customFanBaseObject()
  const fanBlade = meshMaker.customFanBladeObject()
  const sphere = meshMaker.objectConstructor(meshMaker.sphereConstructor(100, 100))
  const cylinder = meshMaker.objectConstructor(meshMaker.cylinderConstructor(50, 150, 100))

  const groupFan = meshMaker.objectConstructor(null)
  groupFan.add(fanBase)
  groupFan.add(fanBlade)

  scene.add(freddy)
  scene.add(fanBase)
  scene.add(fanBlade)
  scene.add(sphere)
  scene.add(cylinder)

  // Transforms
  freddy.scale(10, -10, 10)
  freddy.translate(-350, 166, 100)
  freddy.meshData.toggleSmooth()

  fanBase.rotate(-Math.PI / 2, Math.PI, 0)
  fanBase.scale(50, 50, 50)
  fanBase.translate(100, -186, -100)

  fanBlade.rotate(0, Math.PI, 0)
  fanBlade.scale(50, 50, -50)
  fanBlade.translate(0, 1.5, 0)

  sphere.translate(0, 0, 0)
  sphere.meshData.toggleClockwise()
  cylinder.translate(-350, -450, 100)
  cylinder.scale(1, 1, 1)
  cylinder.meshData.toggleSmooth()

  // Cameras
  const cameraMain = new Camera([0, 0, -500], [0, 0, 0])
  const cameraFan = new Camera([100, -186, -300], [100, -186, -100])
  const cameraFreddy = new Camera([-350, 166, -300], [-350, 166, 100])
  scene.setActiveCamera(cameraMain)

  return { scene, cameras: { cameraMain, cameraFan, cameraFreddy }, freddy, fanBase, fanBlade, sphere, cylinder }
}
