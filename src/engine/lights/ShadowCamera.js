import { m4, v3 } from '../math/matrix.js'

export class ShadowCameraComponent {
  constructor(gl, position, target, vsSource, fsSource, size = 1024) {
    this.gl = gl
    this.position = position
    this.target = target
    this.size = size
    this.depthTexture = null
    this.framebuffer = null

    this.viewMatrix = m4.lookAt(position, target, [0, 1, 0])
    this.projectionMatrix = m4.orthographic(-300, 300, -300, 300, -600, 600)
    this.shadowMatrix = m4.multiply(this.projectionMatrix, this.viewMatrix)

    this.depthProgram = this.createShaderProgram(vsSource, fsSource)
    this._setupDepthFramebuffer()
  }

  _setupDepthFramebuffer() {
    const gl = this.gl

    // Depth texture
    const depthTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, depthTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, this.size, this.size, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    // Framebuffer
    const fb = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0)

    // Unbind
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)

    this.depthTexture = depthTexture
    this.framebuffer = fb
  }

  createShaderProgram(vsSource, fsSource) {
    const gl = this.gl
    const vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, vsSource)
    gl.compileShader(vs)
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(vs))

    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, fsSource)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(fs))

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program))

    return program
  }

  renderDepthMap(scene) {
    const gl = this.gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.viewport(0, 0, this.size, this.size)
    gl.clear(gl.DEPTH_BUFFER_BIT)

    gl.useProgram(this.depthProgram)

    scene.objects.forEach(obj => {
      if (!obj.meshData || !obj.meshData.verts) return
      const modelMatrix = obj.getModelMatrix()
      const mvp = m4.multiply(this.shadowMatrix, modelMatrix)

      const u_mvp = gl.getUniformLocation(this.depthProgram, 'u_mvp')
      gl.uniformMatrix4fv(u_mvp, false, mvp)

      obj.meshData.uploadToGPU(gl)
      obj.meshData.bind(gl, this.depthProgram)
      gl.drawArrays(gl.TRIANGLES, 0, obj.meshData.verts.length / 3)
    })

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
}
