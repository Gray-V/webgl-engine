import meshData from './meshData.js'
import object from '../objects/object.js'
import {
  createCubeVertices,
  createSphereVertices,
  createCylinderVertices,
  createPyramidVertices,
  createRectangleVertices
} from '../geometry/index.js'


const meshMaker = {
  // Geometry constructors that create meshData objects
  sphereConstructor: function (radius = 100, latBands = 12, longBands = 12) {
    const verts = createSphereVertices(radius, latBands, longBands)
    return new meshData(verts, null, [0.7, 0.7, 1])
  },

  rectangleConstructor: function (width, height) {
    const verts = createRectangleVertices(width, height)
    return new meshData(verts, null, [0, 1, 0])
  },

  boxConstructor: function (width, height, length) {
    const verts = createCubeVertices(width, height, length)
    return new meshData(verts, null, [1, 0, 0])
  },

  pyramidConstructor: function (width, height) {
    const verts = createPyramidVertices(width, height)
    return new meshData(verts, null, [1, 0, 0])
  },

  cylinderConstructor: function (radius = 1, height = 2, radialSegments = 32) {
    const verts = createCylinderVertices(radius, height, radialSegments)
    return new meshData(verts, null, [1, 0, 0])
  },

  // Object constructors that create 3D objects
  objectConstructor: function (meshData) {
    return new object(meshData, [0, 0, 0], [0, 0, 0], [1, 1, 1])
  },

  // JSON object constructors
  customFromJson: function (json, color = [0.6, 0.6, 0.6]) {
    const verts = json.vertices
    const uvs = json.uvs || null
    return new object(new meshData(verts, uvs, color), json.position, json.rotation, json.scale)
  }

}

export default meshMaker
