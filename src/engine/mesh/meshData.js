import meshUtil from './meshUtils.js'

class meshData {
  constructor(verts, uvs, color, normals = null) {
    /* verts is a flat array containing triangles
       Format: every 3 floats is a vertex, every 3 vertices is a triangle.
       Vertex repetition is expected (not indexed). */

    this.verts = verts
    this.uvs = uvs

    // Use custom normals if provided, otherwise generate them
    this.normals = normals || meshUtil.FindVertexNormals(verts)

    // Flip Y for all normals to match inverted Y projection
    for (let i = 1; i < this.normals.length; i += 3) {
      this.normals[i] = -this.normals[i];
    }

    this.color = color
    this.isWireFrame = false
    this.isSmooth = true
    this.showNormals = false
    this.clockwise = false
  }

  toggleWireFrame() {
    this.isWireFrame = !this.isWireFrame
  }

  toggleSmooth() {
    this.isSmooth = !this.isSmooth
    if (this.isSmooth) {
      this.normals = meshUtil.FindVertexNormals(this.verts)
    } else {
      this.normals = meshUtil.FindFaceNormals(this.verts)
    }
  }

  toggleShowNormals() {
    this.showNormals = !this.showNormals
  }

  toggleClockwise() {
    this.clockwise = !this.clockwise
  }
}

export default meshData
