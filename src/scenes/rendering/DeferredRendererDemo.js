import Scene from '../../engine/scene.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../../engine/shaders/index.js'
import Shapes from '../../engine/geometry/shapes.js'

export function createDeferredRendererDemo(gl) {
  const scene = new Scene(gl, VERTEX_SHADER, FRAGMENT_SHADER, true)

  // Create many objects (good for deferred rendering)
  const objects = []

  // Create a large grid of cubes (many objects)
  for (let x = -4; x <= 4; x++) {
    for (let z = -4; z <= 4; z++) {
      const cube = Shapes.cube(
        25,
        [x * 60, 0, z * 60 - 200],
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

  // Add many spheres in different positions
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const radius = 150
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius - 200
    
    const sphere = Shapes.sphere(
      20 + Math.random() * 10,
      10 + Math.floor(Math.random() * 6),
      10 + Math.floor(Math.random() * 6),
      [x, 30 + Math.random() * 40, z],
      [0, 0, 0],
      [1, 1, 1],
      [Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.3],
      {
        shininess: 32 + Math.random() * 96,
        metallic: Math.random() * 0.8,
        roughness: Math.random() * 0.8
      }
    )
    sphere.name = `sphere_${i}`
    objects.push(sphere)
    scene.add(sphere)
  }

  // Add cylinders in a pattern
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const radius = 120
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius - 300
    
    const cylinder = Shapes.cylinder(
      15 + Math.random() * 10,
      40 + Math.random() * 30,
      8 + Math.floor(Math.random() * 8),
      [x, 0, z],
      [0, 0, 0],
      [1, 1, 1],
      [Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.3],
      {
        shininess: 48 + Math.random() * 48,
        metallic: Math.random() * 0.6,
        roughness: Math.random() * 0.6
      }
    )
    cylinder.name = `cylinder_${i}`
    objects.push(cylinder)
    scene.add(cylinder)
  }

  // Add pyramids
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const radius = 100
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius - 400
    
    const pyramid = Shapes.pyramid(
      30 + Math.random() * 20,
      40 + Math.random() * 30,
      [x, 0, z],
      [0, 0, 0],
      [1, 1, 1],
      [Math.random() * 0.5 + 0.5, Math.random() * 0.3 + 0.2, Math.random() * 0.3 + 0.2],
      {
        shininess: 16 + Math.random() * 32,
        metallic: Math.random() * 0.3,
        roughness: Math.random() * 0.8 + 0.2
      }
    )
    pyramid.name = `pyramid_${i}`
    objects.push(pyramid)
    scene.add(pyramid)
  }

  // Add some special material spheres
  const metallicSphere = Shapes.metallicSphere(30, [0, 80, -200], [0.9, 0.9, 0.8])
  metallicSphere.name = 'metallicSphere'
  objects.push(metallicSphere)
  scene.add(metallicSphere)

  const glassSphere = Shapes.glassSphere(25, [0, 120, -200])
  glassSphere.name = 'glassSphere'
  objects.push(glassSphere)
  scene.add(glassSphere)

  // Add ground plane
  const ground = Shapes.ground(800, [0, -60, 0], [0.3, 0.6, 0.3], {
    shininess: 4,
    metallic: 0.0,
    roughness: 1.0
  })
  ground.name = 'ground'
  objects.push(ground)
  scene.add(ground)

  // Set up many lights (good for deferred rendering)
  scene.lights = {
    directional: {
      direction: [1, -1, 1],
      color: [1.0, 1.0, 1.0],
      intensity: 1.0
    },
    pointLights: [
      { position: [200, 100, -200], color: [1.0, 0.8, 0.6], intensity: 0.8 },
      { position: [-200, 100, -200], color: [0.6, 0.8, 1.0], intensity: 0.7 },
      { position: [0, 200, -100], color: [1.0, 1.0, 0.8], intensity: 0.6 },
      { position: [0, -100, -300], color: [0.8, 1.0, 0.8], intensity: 0.5 },
      { position: [300, 50, -150], color: [1.0, 0.6, 0.8], intensity: 0.4 },
      { position: [-300, 50, -150], color: [0.8, 0.8, 1.0], intensity: 0.4 },
      { position: [150, 150, -250], color: [1.0, 0.8, 0.4], intensity: 0.3 },
      { position: [-150, 150, -250], color: [0.4, 1.0, 0.8], intensity: 0.3 },
      { position: [0, 100, -350], color: [0.8, 0.4, 1.0], intensity: 0.3 },
      { position: [250, 0, -200], color: [1.0, 1.0, 0.6], intensity: 0.2 }
    ]
  }

  // Set up projection
  scene.setProjection(true)

  return {
    scene,
    objects,
    rendererType: 'deferred'
  }
} 