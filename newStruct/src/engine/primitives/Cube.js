export default class CubeMesh {
  constructor() {
    this.vertices = new Float32Array([
      // positions       // normals        // uvs 
      -1, -1, -1,  0, 0, -1,  0, 0,
       1, -1, -1,  0, 0, -1,  1, 0,
       1,  1, -1,  0, 0, -1,  1, 1,
      -1,  1, -1,  0, 0, -1,  0, 1,

      -1, -1,  1,  0, 0, 1,   0, 0,
       1, -1,  1,  0, 0, 1,   1, 0,
       1,  1,  1,  0, 0, 1,   1, 1,
      -1,  1,  1,  0, 0, 1,   0, 1,
    ])

    this.indices = new Uint16Array([
      0, 1, 2,  0, 2, 3,  // back
      4, 5, 6,  4, 6, 7,  // front
      4, 0, 3,  4, 3, 7,  // left
      1, 5, 6,  1, 6, 2,  // right
      3, 2, 6,  3, 6, 7,  // top
      4, 5, 1,  4, 1, 0,  // bottom
    ])

    this.vao = null
    this.vbo = null
    this.ebo = null
  }

  uploadToGPU(gl) {
    if (this.vao) return

    this.vao = gl.createVertexArray()
    this.vbo = gl.createBuffer()
    this.ebo = gl.createBuffer()

    gl.bindVertexArray(this.vao)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW)

    // We will configure attribute pointers in your MeshRenderer (so no enableVertexAttribArray here)

    gl.bindVertexArray(null)
  }

  bind(gl) {
    gl.bindVertexArray(this.vao)
  }
}
