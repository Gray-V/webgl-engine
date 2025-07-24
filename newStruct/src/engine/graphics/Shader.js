export default class Shader {
  constructor(gl, vertexSource, fragmentSource) {
    this.gl = gl;
    this.program = this.createProgram(vertexSource, fragmentSource);
  }

  use() {
    this.gl.useProgram(this.program);
  }

  getUniformLocation(name) {
    return this.gl.getUniformLocation(this.program, name);
  }

  setUniform(name, value, textureUnit = 0) {
    const gl = this.gl;
    const loc = this.getUniformLocation(name);

    if (typeof value === 'number') {
      gl.uniform1f(loc, value);
    } else if (Array.isArray(value)) {
      switch (value.length) {
        case 2: gl.uniform2fv(loc, value); break;
        case 3: gl.uniform3fv(loc, value); break;
        case 4: gl.uniform4fv(loc, value); break;
        case 9: gl.uniformMatrix3fv(loc, false, value); break;
        case 16: gl.uniformMatrix4fv(loc, false, value); break;
      }
    } else if (value instanceof WebGLTexture) {
      gl.activeTexture(gl.TEXTURE0 + textureUnit);
      gl.bindTexture(gl.TEXTURE_2D, value);
      gl.uniform1i(loc, textureUnit);
    }
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(vertexSource, fragmentSource) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }
    return program;
  }
}
