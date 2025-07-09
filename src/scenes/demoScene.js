import Scene from '../engine/scene.js'
import Camera from '../engine/camera.js'
import { m4 } from '../engine/matrix.js'
import Object from '../engine/object.js'
import meshMaker from '../engine/meshMaker.js'

import FreddyJSON from '../../resources/Freddy.json'
import TableJSON from '../../resources/Table.json'
import SpeakerJSON from '../../resources/Speaker.json'
import FanJSON from '../../resources/Fan.json'
import CupJSON from '../../resources/Cup.json'
import TVAltJSON from '../../resources/TVAlt.json'
import CupcakeJSON from '../../resources/Cupcake.json'
import TVMonitorJSON from '../../resources/TVMonitor.json'
import TVAlt2JSON from '../../resources/TVAlt2.json'

export function createDemoScene(gl, vertexShader, fragmentShader) {
  const perspective = true
  const sphere2 = meshMaker.objectConstructor(meshMaker.sphereConstructor(2, 2))
  sphere2.meshData.color = [0, 1, 0] // Green
  sphere2.setPosition([0, 45, 1])
  const cylinder2 = meshMaker.objectConstructor(meshMaker.cylinderConstructor(0.5, 2, 16))
  cylinder2.meshData.color = [0, 1, 0] // Green
  cylinder2.setPosition([2, 0, 0])
  const scene = new Scene(gl, vertexShader, fragmentShader, perspective, sphere2, cylinder2)

  const camera = new Camera([0, 0, -100], [0, 0, 0])
  camera.getViewMatrix()
  camera.rotate(m4.xRotationMatrix(-1.57))
  camera.lookAt(0, 0, 0)
  scene.setActiveCamera(camera)
  scene.sceneTransform = m4.translate(scene.sceneTransform, 0, -10, -115)

  const freddy = scene.addJSONObj(FreddyJSON, [0.2, 0.6, 1])
  const table = scene.addJSONObj(TableJSON, [0.5, 0.3, 0.1])
  scene.addJSONObj(SpeakerJSON, [0.1, 0.1, 0.1])
  const fan = scene.addJSONObj(FanJSON, [0.7, 0.7, 0.7])
  const cup = scene.addJSONObj(CupJSON, [1, 1, 1])
  const tv1 = scene.addJSONObj(TVAltJSON, [0.2, 0.2, 0.2])
  const tv2 = scene.addJSONObj(TVMonitorJSON, [0.1, 0.3, 0.5])
  const tv3 = scene.addJSONObj(TVAlt2JSON, [0.4, 0.4, 0.4])

  const sphereGroup = meshMaker.objectConstructor(null)

  const sphere1 = meshMaker.objectConstructor(meshMaker.sphereConstructor(2, 2))
  // sphere1.meshData.color = [1, 0, 0] // Red
  sphere1.setPosition([0, 0, 0])

  const sphere3 = meshMaker.objectConstructor(meshMaker.sphereConstructor(2, 2))
  sphere3.meshData.color = [0, 0, 1] // Blue
  sphere3.setPosition([15, 32, 0])

  const sphere4 = meshMaker.objectConstructor(meshMaker.sphereConstructor(2, 2))
  sphere4.meshData.color = [1, 1, 0] // Yellow
  sphere4.setPosition([-15, 25, 1])

  const sphere5 = meshMaker.objectConstructor(meshMaker.sphereConstructor(2, 2))
  sphere5.meshData.color = [1, 0, 1] // Magenta
  sphere5.setPosition([22, 45, 0])

  sphere2.setParent(sphere1)
  sphere3.setParent(sphere1)
  sphere4.setParent(sphere1)
  sphere5.setParent(sphere1)
  scene.add(sphere1)

  const boxGroup = meshMaker.objectConstructor(null)

  // Create the main box (parent)
  const box1 = meshMaker.objectConstructor(meshMaker.boxConstructor(6, 6, 6))
  // box1.meshData.color = [1, 0, 0] // Red
  box1.setPosition([0, 30, 0])

  // Create child boxes with different colors and positions
  const box2 = meshMaker.objectConstructor(meshMaker.boxConstructor(6, 6, 6))
  box2.meshData.color = [0, 1, 0] // Green
  box2.setPosition([-20, 10, 1])

  const box3 = meshMaker.objectConstructor(meshMaker.boxConstructor(6, 6, 6))
  box3.meshData.color = [0, 0, 1] // Blue
  box3.setPosition([10, 8, 0])

  // Set the other boxes as children of the main box
  box2.setParent(box1)
  box3.setParent(box1)

  // Add the main box (with its children) to the scene
  scene.add(box1)

  // Create a main cylinder group object (without a mesh, just a parent)
  const cylinderGroup = meshMaker.objectConstructor(null)

  // Create three tiny cylinders
  const cylinder1 = meshMaker.objectConstructor(meshMaker.cylinderConstructor(0.5, 2, 16))
  cylinder1.meshData.color = [0.8, 0.8, 0.8] // Red
  cylinder1.setPosition([5, 40, 12])
  // cylinder1.setRotation([Math.PI / 2, 0, 0])

  const cylinder3 = meshMaker.objectConstructor(meshMaker.cylinderConstructor(0.5, 2, 16))
  cylinder3.meshData.color = [0, 0, 1] // Blue
  cylinder3.setPosition([-8, 0, 0])

  // Set the cylinders as children of the main group
  cylinder2.setParent(cylinder1)
  cylinder3.setParent(cylinder1)

  // Add the main cylinder (with its children) to the scene
  scene.add(cylinder1)

  return {
    scene,
    freddy,
    camera,
    sphere1,
    sphere2,
    sphere3,
    sphere4,
    sphere5,
    box1,
    box2,
    box3,
    cylinder1,
    cylinder2,
    cylinder3
  }
  //return { scene, freddy, table, cupcake, fan, cup, camera, group1, group2, group3 }
}
