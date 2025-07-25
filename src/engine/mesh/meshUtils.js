import { v3 } from '../math/matrix.js'

const meshUtil = {
  FindVertexNormals(verts) {
    /*  vertexNormals is a dictionary containing vertex normal values and the indexes of the vertexes in verts
        Format is as follows:
        First three indexes is the normal value, Next remaining indexes are any indexes of the vertex in verts    */
    let vertexNormals = {}

    //foreach face calculate face normals and add to vertex normal after
    for (let i = 0; i < verts.length; i += 9) {
      let vert1 = [verts[i], verts[i + 1], verts[i + 2]]
      let vert2 = [verts[i + 3], verts[i + 4], verts[i + 5]]
      let vert3 = [verts[i + 6], verts[i + 7], verts[i + 8]]

      let edge1 = v3.subtract(vert2, vert1)
      let edge2 = v3.subtract(vert3, vert1)

      let faceNormal = v3.normalize(v3.cross(edge1, edge2))

      let vert1Key = vert1.join(',')
      if (vert1Key in vertexNormals) {
        vertexNormals[vert1Key][0] += faceNormal[0]
        vertexNormals[vert1Key][1] += faceNormal[1]
        vertexNormals[vert1Key][2] += faceNormal[2]
      } else {
        vertexNormals[vert1Key] = faceNormal
      }
      vertexNormals[vert1Key].push(i)

      let vert2Key = vert2.join(',')
      if (vert2Key in vertexNormals) {
        vertexNormals[vert2Key][0] += faceNormal[0]
        vertexNormals[vert2Key][1] += faceNormal[1]
        vertexNormals[vert2Key][2] += faceNormal[2]
      } else {
        vertexNormals[vert2Key] = faceNormal
      }
      vertexNormals[vert2Key].push(i + 3)

      let vert3Key = vert3.join(',')
      if (vert3Key in vertexNormals) {
        vertexNormals[vert3Key][0] += faceNormal[0]
        vertexNormals[vert3Key][1] += faceNormal[1]
        vertexNormals[vert3Key][2] += faceNormal[2]
      } else {
        vertexNormals[vert3Key] = faceNormal
      }
      vertexNormals[vert3Key].push(i + 6)
    }

    let normals = new Array(verts.length)

    //After vertexNormals are calculated return normals in a similar format as verts
    const normalValuePairs = Object.values(vertexNormals)
    for (let i = 0; i < normalValuePairs.length; i++) {
      let normalValuePair = normalValuePairs[i]
      let normal = v3.normalize([normalValuePair[0], normalValuePair[1], normalValuePair[2]])

      for (let j = 3; j < normalValuePair.length; j++) {
        normals[normalValuePair[j]] = normal[0]
        normals[normalValuePair[j] + 1] = normal[1]
        normals[normalValuePair[j] + 2] = normal[2]
      }
    }

    return normals
  },
FindFaceNormals(verts) {
  const normals = new Array(verts.length)

  for (let i = 0; i < verts.length; i += 9) {
    const v1 = [verts[i], verts[i + 1], verts[i + 2]]
    const v2 = [verts[i + 3], verts[i + 4], verts[i + 5]]
    const v3_ = [verts[i + 6], verts[i + 7], verts[i + 8]]

    const edge1 = v3.subtract(v2, v1)
    const edge2 = v3.subtract(v3_, v1)
    const faceNormal = v3.normalize(v3.cross(edge1, edge2))

    for (let j = 0; j < 3; j++) {
      normals[i + j * 3 + 0] = faceNormal[0]
      normals[i + j * 3 + 1] = faceNormal[1]
      normals[i + j * 3 + 2] = faceNormal[2]
    }
  }

  return normals
}



}

export default meshUtil
