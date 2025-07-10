import meshMaker from './meshMaker.js'
import object from './object.js'



export const Shapes = {
  /**
   * Create a cube object
   * @param {number} size - Size of the cube (width = height = length)
   * @param {Array} position - [x, y, z] position
   * @param {Array} rotation - [x, y, z] rotation in radians
   * @param {Array} scale - [x, y, z] scale
   * @param {Array} color - [r, g, b] color (0-1)
   * @param {Object} material - Material properties
   * @returns {object} 3D cube object
   */
  cube: (size = 100, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color = [1, 0, 0], material = {}) => {
    const mesh = meshMaker.boxConstructor(size, size, size)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 32, metallic: 0.1, roughness: 0.3, ...material }
    return obj
  },

  /**
   * Create a box object (rectangular prism)
   * @param {number} width - Width of the box
   * @param {number} height - Height of the box
   * @param {number} length - Length of the box
   * @param {Array} position - [x, y, z] position
   * @param {Array} rotation - [x, y, z] rotation in radians
   * @param {Array} scale - [x, y, z] scale
   * @param {Array} color - [r, g, b] color (0-1)
   * @param {Object} material - Material properties
   * @returns {object} 3D box object
   */
  box: (width = 100, height = 100, length = 100, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color = [1, 0, 0], material = {}) => {
    const mesh = meshMaker.boxConstructor(width, height, length)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 32, metallic: 0.1, roughness: 0.3, ...material }
    return obj
  },

  /**
   * Create a sphere object
   * @param {number} radius - Radius of the sphere
   * @param {number} latBands - Number of latitude bands (resolution)
   * @param {number} longBands - Number of longitude bands (resolution)
   * @param {Array} position - [x, y, z] position
   * @param {Array} rotation - [x, y, z] rotation in radians
   * @param {Array} scale - [x, y, z] scale
   * @param {Array} color - [r, g, b] color (0-1)
   * @param {Object} material - Material properties
   * @returns {object} 3D sphere object
   */
  sphere: (radius = 50, latBands = 12, longBands = 12, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color = [0.7, 0.7, 1], material = {}) => {
    const mesh = meshMaker.sphereConstructor(radius, latBands, longBands)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 64, metallic: 0.2, roughness: 0.1, ...material }
    return obj
  },

  /**
   * Create a cylinder object
   * @param {number} radius - Radius of the cylinder
   * @param {number} height - Height of the cylinder
   * @param {number} radialSegments - Number of radial segments (resolution)
   * @param {Array} position - [x, y, z] position
   * @param {Array} rotation - [x, y, z] rotation in radians
   * @param {Array} scale - [x, y, z] scale
   * @param {Array} color - [r, g, b] color (0-1)
   * @param {Object} material - Material properties
   * @returns {object} 3D cylinder object
   */
  cylinder: (radius = 25, height = 100, radialSegments = 16, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color = [0.8, 0.8, 0.8], material = {}) => {
    const mesh = meshMaker.cylinderConstructor(radius, height, radialSegments)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 48, metallic: 0.3, roughness: 0.2, ...material }
    return obj
  },

  /**
   * Create a pyramid object
   * @param {number} width - Width of the pyramid base
   * @param {number} height - Height of the pyramid
   * @param {Array} position - [x, y, z] position
   * @param {Array} rotation - [x, y, z] rotation in radians
   * @param {Array} scale - [x, y, z] scale
   * @param {Array} color - [r, g, b] color (0-1)
   * @param {Object} material - Material properties
   * @returns {object} 3D pyramid object
   */
  pyramid: (width = 100, height = 100, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color = [1, 0.5, 0], material = {}) => {
    const mesh = meshMaker.pyramidConstructor(width, height)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 16, metallic: 0.0, roughness: 0.8, ...material }
    return obj
  },

  /**
   * Create a plane object (flat rectangle)
   * @param {number} width - Width of the plane
   * @param {number} height - Height of the plane
   * @param {Array} position - [x, y, z] position
   * @param {Array} rotation - [x, y, z] rotation in radians
   * @param {Array} scale - [x, y, z] scale
   * @param {Array} color - [r, g, b] color (0-1)
   * @param {Object} material - Material properties
   * @returns {object} 3D plane object
   */
  plane: (width = 100, height = 100, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color = [0.2, 0.8, 0.2], material = {}) => {
    const mesh = meshMaker.rectangleConstructor(width, height)
    mesh.color = color
    const obj = new object(mesh, position, rotation, scale)
    obj.material = { shininess: 8, metallic: 0.0, roughness: 0.9, ...material }
    return obj
  },

  /**
   * Create a ground plane (large flat surface)
   * @param {number} size - Size of the ground plane
   * @param {Array} position - [x, y, z] position
   * @param {Array} color - [r, g, b] color (0-1)
   * @param {Object} material - Material properties
   * @returns {object} 3D ground plane object
   */
  ground: (size = 1000, position = [0, -100, 0], color = [0.3, 0.6, 0.3], material = {}) => {
    const mesh = meshMaker.rectangleConstructor(size, size)
    mesh.color = color
    const obj = new object(mesh, position, [0, 0, 0], [1, 1, 1])
    obj.material = { shininess: 4, metallic: 0.0, roughness: 1.0, ...material }
    return obj
  },

  /**
   * Create a wall object (vertical plane)
   * @param {number} width - Width of the wall
   * @param {number} height - Height of the wall
   * @param {Array} position - [x, y, z] position
   * @param {Array} rotation - [x, y, z] rotation in radians
   * @param {Array} color - [r, g, b] color (0-1)
   * @param {Object} material - Material properties
   * @returns {object} 3D wall object
   */
  wall: (width = 100, height = 100, position = [0, 0, 0], rotation = [0, 0, 0], color = [0.8, 0.8, 0.8], material = {}) => {
    const mesh = meshMaker.rectangleConstructor(width, height)
    mesh.color = color
    const obj = new object(mesh, position, rotation, [1, 1, 1])
    obj.material = { shininess: 16, metallic: 0.0, roughness: 0.7, ...material }
    return obj
  },

  /**
   * Create a metallic sphere (shiny)
   * @param {number} radius - Radius of the sphere
   * @param {Array} position - [x, y, z] position
   * @param {Array} color - [r, g, b] color (0-1)
   * @returns {object} 3D metallic sphere object
   */
  metallicSphere: (radius = 50, position = [0, 0, 0], color = [0.8, 0.8, 0.9]) => {
    return Shapes.sphere(radius, 16, 16, position, [0, 0, 0], [1, 1, 1], color, {
      shininess: 128,
      metallic: 0.9,
      roughness: 0.1
    })
  },

  /**
   * Create a glass sphere (transparent-like effect)
   * @param {number} radius - Radius of the sphere
   * @param {Array} position - [x, y, z] position
   * @returns {object} 3D glass sphere object
   */
  glassSphere: (radius = 50, position = [0, 0, 0]) => {
    return Shapes.sphere(radius, 20, 20, position, [0, 0, 0], [1, 1, 1], [0.9, 0.95, 1.0], {
      shininess: 256,
      metallic: 0.0,
      roughness: 0.0
    })
  }
}

// Convenience functions for common shapes
export const createCube = Shapes.cube
export const createBox = Shapes.box
export const createSphere = Shapes.sphere
export const createCylinder = Shapes.cylinder
export const createPyramid = Shapes.pyramid
export const createPlane = Shapes.plane
export const createGround = Shapes.ground
export const createWall = Shapes.wall
export const createMetallicSphere = Shapes.metallicSphere
export const createGlassSphere = Shapes.glassSphere

export default Shapes 