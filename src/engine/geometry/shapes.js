import meshMaker from '../mesh/meshMaker.js'
import object from '../objects/object.js'

export const Shapes = {
  cube: (
    size = 100,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    color = [1, 0, 0],
    material = {}
  ) => {
    const mesh = meshMaker.cubeConstructor(size, size, size, color)
    mesh.color = color
    const adjustedRotation = [
    rotation[0] - Math.PI / 4, // tilt down 45°
    rotation[1] + Math.PI / 6, // slight Y-axis turn
    rotation[2]
  ]

    const obj = new object(mesh, position, adjustedRotation, scale)
    obj.material = { shininess: 32, metallic: 0.1, roughness: 0.3, ...material }
    return obj
  },

  box: (
    width = 100,
    height = 100,
    length = 100,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    color = [1, 0, 0],
    material = {}
  ) => {
    const mesh = meshMaker.cubeConstructor(width, height, length, color)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 32, metallic: 0.1, roughness: 0.3, ...material }
    return obj
  },

  sphere: (
    radius = 50,
    latBands = 12,
    longBands = 12,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    color = [0.7, 0.7, 1],
    material = {}
  ) => {
    const mesh = meshMaker.sphereConstructor(radius, latBands, longBands)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 64, metallic: 0.2, roughness: 0.1, ...material }
    return obj
  },

  cylinder: (
    radius = 25,
    height = 100,
    radialSegments = 16,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    color = [0.8, 0.8, 0.8],
    material = {}
  ) => {
    const mesh = meshMaker.cylinderConstructor(radius, height, radialSegments)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 48, metallic: 0.3, roughness: 0.2, ...material }
    return obj
  },

  pyramid: (
    width = 100,
    height = 100,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    color = [1, 0.5, 0],
    material = {}
  ) => {
    const mesh = meshMaker.pyramidConstructor(width, height)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 16, metallic: 0.0, roughness: 0.8, ...material }
    return obj
  },

  plane: (
    width = 100,
    height = 100,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    color = [0.2, 0.8, 0.2],
    material = {}
  ) => {
    const mesh = meshMaker.rectangleConstructor(width, height)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 8, metallic: 0.0, roughness: 0.9, ...material }
    return obj
  },

  ground: (
    size = 1000,
    position = [0, -100, 0],
    color = [0.3, 0.6, 0.3],
    material = {}
  ) => {
    const mesh = meshMaker.rectangleConstructor(size, size)
    mesh.color = color
    const obj = new object(mesh, position, [0, 0, 0], [1, 1, 1])
    obj.material = { shininess: 4, metallic: 0.0, roughness: 1.0, ...material }
    return obj
  },

  wall: (
    width = 100,
    height = 100,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    color = [0.8, 0.8, 0.8],
    material = {}
  ) => {
    const mesh = meshMaker.rectangleConstructor(width, height)
    mesh.color = color
    const obj = new object(mesh, position, rotation, [1, 1, 1])
    obj.material = { shininess: 16, metallic: 0.0, roughness: 0.7, ...material }
    return obj
  },

  metallicSphere: (radius = 50, position = [0, 0, 0], color = [0.8, 0.8, 0.9]) => {
    return Shapes.sphere(radius, 16, 16, position, [0, 0, 0], [1, 1, 1], color, {
      shininess: 128,
      metallic: 0.9,
      roughness: 0.1
    })
  },

  glassSphere: (radius = 50, position = [0, 0, 0]) => {
    return Shapes.sphere(radius, 20, 20, position, [0, 0, 0], [1, 1, 1], [0.9, 0.95, 1.0], {
      shininess: 256,
      metallic: 0.0,
      roughness: 0.0
    })
  }
}

export const createCube = Shapes.cube
export const createSphere = Shapes.sphere
export const createCylinder = Shapes.cylinder
export const createPyramid = Shapes.pyramid
export const createPlane = Shapes.plane
export const createGround = Shapes.ground
export const createWall = Shapes.wall
export const createMetallicSphere = Shapes.metallicSphere
export const createGlassSphere = Shapes.glassSphere

export default Shapes
