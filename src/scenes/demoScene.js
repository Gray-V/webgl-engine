import Scene from '../engine/scene.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../engine/helpers.js'
import Shapes from '../engine/shapes.js'

export function createDemoScene(gl) {
  // Create a simple spinning cube using the shapes factory
  const cube = Shapes.cube(
    100,                    // size
    [0, 0, -400],          // position
    [Math.PI / 6, Math.PI / 6, 0], // initial rotation
    [1, 1, 1],             // scale
    [1, 0, 0]              // red color
  )
  cube.name = 'spinningCube'

  // Create the scene
  const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER, true, cube, null)
  scene.add(cube)

  // Set up lighting (this will be handled by the shaders)
  scene.setProjection(true)

  return { 
    scene, 
    cube, // This will be the main spinning object
    mainObj: cube, // For compatibility with renderer
    cylinder2: null // For compatibility with renderer
  }
}
