import { m4 } from './matrix.js'

class object {
  constructor(meshData = null, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], parent = null, name = '') {
    this.meshData = meshData
    this.position = position
    this.rotation = rotation
    this.scaleTransform = scale
    this.parent = null
    this.children = []
    this.name = name

    if (parent) {
      this.setParent(parent)
    }
  }

  setParent(parent) {
    if (this.parent && this.parent !== parent) {
      const index = this.parent.children.indexOf(this)
      if (index !== -1) this.parent.children.splice(index, 1)
    }
    this.parent = parent
    if (parent) parent.children.push(this)
  }

  add(child) {
    child.setParent(this)
  }

  translate(dx, dy, dz) {
    this.position[0] += dx
    this.position[1] += dy
    this.position[2] += dz
  }

  rotate(rx, ry, rz) {
    this.rotation[0] += rx
    this.rotation[1] += ry
    this.rotation[2] += rz
  }

  scale(sx, sy, sz) {
    this.scaleTransform[0] *= sx
    this.scaleTransform[1] *= sy
    this.scaleTransform[2] *= sz
  }

  setPosition(position) {
    this.position = position
  }

  setRotation(rotation) {
    this.rotation = rotation
  }

  setScale(scale) {
    this.scaleTransform = scale
  }

  getLocalTransform() {
    let transform = m4.identityMatrix()
    transform = m4.translate(transform, ...this.position)
    transform = m4.xRotate(transform, this.rotation[0])
    transform = m4.yRotate(transform, this.rotation[1])
    transform = m4.zRotate(transform, this.rotation[2])
    transform = m4.scale(transform, ...this.scaleTransform)
    return transform
  }

  getWorldTransform() {
    const local = this.getLocalTransform()
    return this.parent ? m4.multiply(this.parent.getWorldTransform(), local) : local
  }

  draw(gl, shaderProgram, cameraTransform) {
    if (!this.meshData) return

    const posLoc = gl.getAttribLocation(shaderProgram, 'vertexPosition')
    const normLoc = gl.getAttribLocation(shaderProgram, 'vertexNormal')

    if (posLoc !== -1) {
      const posBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.meshData.verts), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
    }

    if (normLoc !== -1 && this.meshData.normals) {
      const normBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.meshData.normals), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(normLoc)
      gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0)
    }

    const transform = this.getWorldTransform()
    const normalMatrix4 = m4.transpose(m4.inverse(transform))
    const normalMatrix = [
      normalMatrix4[0], normalMatrix4[1], normalMatrix4[2],
      normalMatrix4[4], normalMatrix4[5], normalMatrix4[6],
      normalMatrix4[8], normalMatrix4[9], normalMatrix4[10]
    ]

    gl.uniformMatrix3fv(gl.getUniformLocation(shaderProgram, 'normalMatrix'), false, normalMatrix)
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'objectTransform'), false, transform)
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'cameraTransform'), false, cameraTransform)

    gl.uniform1i(gl.getUniformLocation(shaderProgram, 'showNormals'), this.meshData.showNormals)
    gl.uniform1i(gl.getUniformLocation(shaderProgram, 'clockwise'), this.meshData.clockwise)

    const drawMode = this.meshData.isWireFrame ? gl.LINES : gl.TRIANGLES
    gl.drawArrays(drawMode, 0, this.meshData.verts.length / 3)

    for (const child of this.children) {
      child.draw(gl, shaderProgram, cameraTransform)
    }

    if (this.meshData.showNormals) {
      for (let i = 0; i < this.meshData.verts.length; i += 30) {
        const pos = [this.meshData.verts[i], this.meshData.verts[i + 1], this.meshData.verts[i + 2]]
        const norm = [this.meshData.normals[i], this.meshData.normals[i + 1], this.meshData.normals[i + 2]]
        const end = [pos[0] + norm[0], pos[1] + norm[1], pos[2] + norm[2]]
        this.drawDebugLine(gl, shaderProgram, pos, end, [1, 1, 0])
      }
    }
  }

  drawDebugLine(gl, program, start, end, color) {
    const posLoc = gl.getAttribLocation(program, 'vertexPosition')
    if (posLoc === -1) return

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...start, ...end]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)

    gl.uniform3fv(gl.getUniformLocation(program, 'objectColor'), color)
    gl.drawArrays(gl.LINES, 0, 2)
  }
}

class Group extends object {
  constructor(name = 'Group') {
    super(null, [0, 0, 0], [0, 0, 0], [1, 1, 1], null, name)
  }
}

export { object, Group }
export default object
