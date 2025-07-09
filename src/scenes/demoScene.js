import Object3D from '../engine/object.js'
import MeshMaker from '../engine/meshMaker.js'
import Scene from '../engine/scene.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../engine/helpers.js'

export function createDemoScene(gl) {
  const cubeMesh = MeshMaker.boxConstructor(100)
  const cube = new Object3D(cubeMesh)
  cube.position = [0, 0, -400]
  cube.rotation = [Math.PI / 6, Math.PI / 6, 0] // Rotate 30 degrees on X and Y

  // cube.material = {
  //   ambient: [0.3, 0.3, 0.3], // Increased ambient for less black
  //   diffuse: [1.0, 1.0, 1.0],
  //   specular: [1.0, 1.0, 1.0],
  //   shininess: 32.0
  // }

  const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER)
  scene.add(cube)

  // Fixed world-space directional light (do not update based on cube)
  const dir = [1, 1, 1];
  const len = Math.hypot(...dir);
  const normDir = dir.map(x => x / len);
  scene.lights = [
    {
      type: 0, // directional
      direction: normDir,
      color: [1.0, 1.0, 1.0],
      intensity: 1.2
    }
  ];

  scene.setProjection();

  return { scene, cube }
}
