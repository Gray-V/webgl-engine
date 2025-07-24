import Component from '../../core/Component.js'

export default class MeshRenderer extends Component {
  constructor(mesh, material) {
    super()
    this.mesh = mesh
    this.material = material
  }

  render(gl, camera) {
    this.material.use(gl, this.gameObject.transform, camera)

    this.mesh.uploadToGPU(gl)
    this.mesh.bind(gl)

    // Bind a_position attribute (assume it's first 3 floats in vertex layout)
    const loc = this.material.shader.getAttribLocation('a_position')
    if (loc !== -1) {
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 8 * 4, 0)
    }

    gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0)
  }
}
