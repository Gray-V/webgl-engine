import Scene from '../engine/scene.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../engine/helpers.js'
import Shapes from '../engine/shapes.js'

export function createShapesDemoScene(gl) {
  const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER, true)

  // Create various shapes to showcase the factory
  const cube = Shapes.cube(50, [0, 0, -200], [0, 0, 0], [1, 1, 1], [1, 0, 0])
  cube.name = 'cube'

  const sphere = Shapes.sphere(40, 12, 12, [150, 0, -200], [0, 0, 0], [1, 1, 1], [0, 0, 1])
  sphere.name = 'sphere'

  const cylinder = Shapes.cylinder(30, 80, 16, [-150, 0, -200], [0, 0, 0], [1, 1, 1], [0, 1, 0])
  cylinder.name = 'cylinder'

  const pyramid = Shapes.pyramid(60, 80, [0, 0, -400], [0, 0, 0], [1, 1, 1], [1, 0.5, 0])
  pyramid.name = 'pyramid'

  const ground = Shapes.ground(800, [0, -150, 0], [0.3, 0.6, 0.3])
  ground.name = 'ground'

  // Add all objects to the scene
  scene.add(cube)
  scene.add(sphere)
  scene.add(cylinder)
  scene.add(pyramid)
  scene.add(ground)

  // Set up projection
  scene.setProjection(true)

  return {
    scene,
    objects: {
      cube,
      sphere,
      cylinder,
      pyramid,
      ground
    }
  }
} 