import meshUtil from './meshUtils.js'

class meshData {
  constructor(verts, uvs, color) {
    /*  verts is an array containing vertex data and face data
            The format for verts is as follows:
            Every three indexes represents a vertex
            Every three vertexes represent a face
            This also means vertexs are repeated    */
    this.verts = verts
    this.uvs = uvs
    this.normals = meshUtil.FindVertexNormals(verts)
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
