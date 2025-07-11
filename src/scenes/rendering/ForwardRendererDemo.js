import Scene from '../../engine/scene.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../../engine/shaders/helpers.js'
import Shapes from '../../engine/geometry/shapes.js'

export function createForwardRendererDemo(gl) {
  const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER, true)

  // Create a moderate number of objects (good for forward rendering)
  const objects = []

  // Create a grid of cubes
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      const cube = Shapes.cube(
        30,
        [x * 80, 0, z * 80 - 200],
        [0, 0, 0],
        [1, 1, 1],
        [0.8, 0.3, 0.3],
        {
          shininess: 32,
          metallic: 0.2,
          roughness: 0.4
        }
      )
      cube.name = `cube_${x}_${z}`
      objects.push(cube)
      scene.add(cube)
    }
  }

  // Add some spheres
  const sphere1 = Shapes.sphere(25, 12, 12, [150, 50, -200], [0, 0, 0], [1, 1, 1], [0.3, 0.8, 0.3], {
    shininess: 64,
    metallic: 0.1,
    roughness: 0.2
  })
  sphere1.name = 'sphere1'
  objects.push(sphere1)
  scene.add(sphere1)

  const sphere2 = Shapes.sphere(20, 10, 10, [-150, 30, -200], [0, 0, 0], [1, 1, 1], [0.3, 0.3, 0.8], {
    shininess: 128,
    metallic: 0.0,
    roughness: 0.1
  })
  sphere2.name = 'sphere2'
  objects.push(sphere2)
  scene.add(sphere2)

  // Add cylinders
  const cylinder1 = Shapes.cylinder(20, 60, 12, [100, 0, -300], [0, 0, 0], [1, 1, 1], [0.8, 0.8, 0.3], {
    shininess: 48,
    metallic: 0.3,
    roughness: 0.3
  })
  cylinder1.name = 'cylinder1'
  objects.push(cylinder1)
  scene.add(cylinder1)

  const cylinder2 = Shapes.cylinder(15, 50, 10, [-100, 0, -300], [0, 0, 0], [1, 1, 1], [0.8, 0.3, 0.8], {
    shininess: 96,
    metallic: 0.5,
    roughness: 0.2
  })
  cylinder2.name = 'cylinder2'
  objects.push(cylinder2)
  scene.add(cylinder2)

  // Add pyramids
  const pyramid1 = Shapes.pyramid(40, 60, [0, 0, -400], [0, 0, 0], [1, 1, 1], [1, 0.5, 0], {
    shininess: 16,
    metallic: 0.0,
    roughness: 0.8
  })
  pyramid1.name = 'pyramid1'
  objects.push(pyramid1)
  scene.add(pyramid1)

  // Add ground plane
  const ground = Shapes.ground(600, [0, -80, 0], [0.3, 0.6, 0.3], {
    shininess: 4,
    metallic: 0.0,
    roughness: 1.0
  })
  ground.name = 'ground'
  objects.push(ground)
  scene.add(ground)

  // Set up moderate lighting (good for forward rendering)
  scene.lights = {
    directional: {
      direction: [1, -1, 1],
      color: [1.0, 1.0, 1.0],
      intensity: 1.0
    },
    pointLights: [
      { position: [200, 100, -200], color: [1.0, 0.8, 0.6], intensity: 0.6 },
      { position: [-200, 100, -200], color: [0.6, 0.8, 1.0], intensity: 0.5 },
      { position: [0, 150, -100], color: [1.0, 1.0, 0.8], intensity: 0.4 }
    ]
  }

  // Set up projection
  scene.setProjection(true)

  return {
    scene,
    objects,
    rendererType: 'forward'
  }
} 