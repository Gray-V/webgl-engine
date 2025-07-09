import meshData from './meshData.js'
import object from './object.js'

import freddyJson from '../../resources/Freddy.json'
import fanBaseJson from '../../resources/fanBase.json'
import fanBladeJson from '../../resources/fanBlade.json'

const meshMaker = {
  sphereConstructor: function (radius = 100, latBands = 12, longBands = 12) {
    const verts = []

    for (let lat = 0; lat < latBands; lat++) {
      const theta1 = (lat * Math.PI) / latBands
      const theta2 = ((lat + 1) * Math.PI) / latBands

      for (let lon = 0; lon < longBands; lon++) {
        const phi1 = (lon * 2 * Math.PI) / longBands
        const phi2 = ((lon + 1) * 2 * Math.PI) / longBands

        const x1 = radius * Math.sin(theta1) * Math.cos(phi1)
        const y1 = radius * Math.cos(theta1)
        const z1 = radius * Math.sin(theta1) * Math.sin(phi1)

        const x2 = radius * Math.sin(theta2) * Math.cos(phi1)
        const y2 = radius * Math.cos(theta2)
        const z2 = radius * Math.sin(theta2) * Math.sin(phi1)

        const x3 = radius * Math.sin(theta2) * Math.cos(phi2)
        const y3 = radius * Math.cos(theta2)
        const z3 = radius * Math.sin(theta2) * Math.sin(phi2)

        const x4 = radius * Math.sin(theta1) * Math.cos(phi2)
        const y4 = radius * Math.cos(theta1)
        const z4 = radius * Math.sin(theta1) * Math.sin(phi2)

        // Triangle 1
        verts.push(x1, y1, z1)
        verts.push(x2, y2, z2)
        verts.push(x3, y3, z3)

        // Triangle 2
        verts.push(x1, y1, z1)
        verts.push(x3, y3, z3)
        verts.push(x4, y4, z4)
      }
    }

    return new meshData(verts, null, [0.7, 0.7, 1])
  },
  rectangleConstructor: function (width, height) {
    const hWidth = width / 2
    const hHeight = height / 2
    return new meshData(
      [
        -hWidth,
        -hHeight,
        0,
        hWidth,
        -hHeight,
        0,
        -hWidth,
        hHeight,
        0,
        hWidth,
        -hHeight,
        0,
        -hWidth,
        hHeight,
        0,
        hWidth,
        hHeight,
        0
      ],
      null, //uvs (null for now)
      [0, 1, 0] //color
    )
  },

  boxConstructor: function (width, height, length) {
    const x = width / 2
    const y = height / 2
    const z = length / 4
    return new meshData(
      [
        -x,
        y,
        -z,
        -x,
        y,
        z,
        -x,
        -y,
        z,
        -x,
        y,
        -z,
        -x,
        -y,
        -z,
        -x,
        -y,
        z,
        //face 1
        x,
        y,
        -z,
        x,
        y,
        z,
        x,
        -y,
        z,
        x,
        y,
        -z,
        x,
        -y,
        -z,
        x,
        -y,
        z,
        //face 2
        -x,
        -y,
        z,
        -x,
        -y,
        -z,
        x,
        -y,
        z,
        x,
        -y,
        z,
        x,
        -y,
        -z,
        -x,
        -y,
        -z,
        //face 3
        -x,
        y,
        z,
        -x,
        y,
        -z,
        x,
        y,
        z,
        x,
        y,
        z,
        x,
        y,
        -z,
        -x,
        y,
        -z,
        //face 4
        -x,
        y,
        -z,
        x,
        y,
        -z,
        x,
        -y,
        -z,
        -x,
        y,
        -z,
        -x,
        -y,
        -z,
        x,
        -y,
        -z,
        //face 5
        -x,
        y,
        z,
        x,
        y,
        z,
        x,
        -y,
        z,
        -x,
        y,
        z,
        -x,
        -y,
        z,
        x,
        -y,
        z
        //face 6
      ],
      null,
      [1, 0, 0]
    )
  },

  pyramidConstructor: function (width, height) {
    const w = width / 2
    const z = w / 2
    const h = height / 2
    return new meshData(
      [
        -w,
        h,
        -z,
        -w,
        h,
        z,
        0,
        -h,
        0,
        //face 1
        w,
        h,
        -z,
        w,
        h,
        z,
        0,
        -h,
        0,
        //face 2
        -w,
        h,
        -z,
        -w,
        h,
        z,
        w,
        h,
        z,
        -w,
        h,
        -z,
        w,
        h,
        -z,
        w,
        h,
        z,
        //face 3
        -w,
        h,
        -z,
        w,
        h,
        -z,
        0,
        -h,
        0,
        //face 4
        -w,
        h,
        z,
        w,
        h,
        z,
        0,
        -h,
        0
        //face 5
      ],
      null,
      [1, 0, 0]
    )
  },

  customFromJson: function (json, color = [0.6, 0.6, 0.6]) {
    const verts = json.vertices;
    const uvs = json.uvs || null;
    return new object(new meshData(verts, uvs, color), json.position, json.rotation, json.scale);
  },
  

  customFreddyObject: function () {
    const verts = freddyJson.vertices
    const uvs = freddyJson.uvs
    return new object(new meshData(verts, uvs, [0, 0, 1]), [0, 0, 0], [0, 0, 0], [1, 1, 1])
  },

  customFanBaseObject: function () {
    const verts = fanBaseJson.vertices
    const uvs = fanBaseJson.uvs
    return new object(new meshData(verts, uvs, [0, 0, 1]), [0, 0, 0], [0, 0, 0], [1, 1, 1])
  },

  customFanBladeObject: function () {
    const verts = fanBladeJson.vertices
    const uvs = fanBladeJson.uvs
    for (let i = 0; i < verts.length; i++) {
      if ((i + 1) % 3 === 0) {
        verts[i] += 0.15
      }
    }
    return new object(new meshData(verts, uvs, [0, 0, 1]), [0, 0, 0], [0, 0, 0], [1, 1, 1])
  },

  objectConstructor: function (meshData) {
    return new object(meshData, [0, 0, 0], [0, 0, 0], [1, 1, 1])
  },

  cylinderConstructor: function (radius = 1, height = 2, radialSegments = 32) {
    const verts = []

    const halfHeight = height / 2
    const angleStep = (2 * Math.PI) / radialSegments

    // Side faces
    for (let i = 0; i < radialSegments; i++) {
      const theta = i * angleStep
      const nextTheta = (i + 1) * angleStep

      const x1 = radius * Math.cos(theta)
      const z1 = radius * Math.sin(theta)
      const x2 = radius * Math.cos(nextTheta)
      const z2 = radius * Math.sin(nextTheta)

      // First triangle (bottom left)
      verts.push(x1, -halfHeight, z1)
      verts.push(x1, halfHeight, z1)
      verts.push(x2, halfHeight, z2)

      // Second triangle (top right)
      verts.push(x1, -halfHeight, z1)
      verts.push(x2, halfHeight, z2)
      verts.push(x2, -halfHeight, z2)
    }

    // Top cap
    for (let i = 0; i < radialSegments; i++) {
      const theta = i * angleStep
      const nextTheta = (i + 1) * angleStep

      const x1 = radius * Math.cos(theta)
      const z1 = radius * Math.sin(theta)
      const x2 = radius * Math.cos(nextTheta)
      const z2 = radius * Math.sin(nextTheta)

      verts.push(0, halfHeight, 0)
      verts.push(x2, halfHeight, z2)
      verts.push(x1, halfHeight, z1)
    }

    // Bottom cap
    for (let i = 0; i < radialSegments; i++) {
      const theta = i * angleStep
      const nextTheta = (i + 1) * angleStep

      const x1 = radius * Math.cos(theta)
      const z1 = radius * Math.sin(theta)
      const x2 = radius * Math.cos(nextTheta)
      const z2 = radius * Math.sin(nextTheta)

      verts.push(0, -halfHeight, 0)
      verts.push(x1, -halfHeight, z1)
      verts.push(x2, -halfHeight, z2)
    }

    return new meshData(verts, null, [1, 0, 0])
  }
}

export default meshMaker
