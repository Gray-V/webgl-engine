import Scene from '../engine/scene.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../engine/helpers.js'
import Shapes from '../engine/shapes.js'

export function createShapesDemoScene(gl) {
  const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER, true)

  // Create various shapes to showcase the factory with different materials
  const cube = Shapes.cube(50, [0, 0, -200], [0, 0, 0], [1, 1, 1], [1, 0, 0], {
    shininess: 64,
    metallic: 0.3,
    roughness: 0.2
  })
  cube.name = 'cube'

  const sphere = Shapes.sphere(40, 16, 16, [150, 0, -200], [0, 0, 0], [1, 1, 1], [0, 0, 1], {
    shininess: 128,
    metallic: 0.1,
    roughness: 0.1
  })
  sphere.name = 'sphere'

  const cylinder = Shapes.cylinder(30, 80, 16, [-150, 0, -200], [0, 0, 0], [1, 1, 1], [0, 1, 0], {
    shininess: 96,
    metallic: 0.5,
    roughness: 0.1
  })
  cylinder.name = 'cylinder'

  const pyramid = Shapes.pyramid(60, 80, [0, 0, -400], [0, 0, 0], [1, 1, 1], [1, 0.5, 0], {
    shininess: 32,
    metallic: 0.0,
    roughness: 0.8
  })
  pyramid.name = 'pyramid'

  // Add some special material spheres
  const metallicSphere = Shapes.metallicSphere(35, [100, 100, -300], [0.9, 0.9, 0.8])
  metallicSphere.name = 'metallicSphere'

  const glassSphere = Shapes.glassSphere(30, [-100, 100, -300])
  glassSphere.name = 'glassSphere'

  const ground = Shapes.ground(800, [0, -150, 0], [0.3, 0.6, 0.3], {
    shininess: 4,
    metallic: 0.0,
    roughness: 1.0
  })
  ground.name = 'ground'

  // Add all objects to the scene
  scene.add(cube)
  scene.add(sphere)
  scene.add(cylinder)
  scene.add(pyramid)
  scene.add(metallicSphere)
  scene.add(glassSphere)
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
      metallicSphere,
      glassSphere,
      ground
    }
  }
} 