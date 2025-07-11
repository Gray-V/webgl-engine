import { m4 } from '../math/matrix.js'

/**
 * Base renderer class that provides common functionality
 * for both deferred and forward rendering approaches
 */
export class BaseRenderer {
  constructor(gl, scene) {
    this.gl = gl
    this.scene = scene
    this.width = gl.canvas.width
    this.height = gl.canvas.height
    
    // Common state
    this.isInitialized = false
    this.renderStats = {
      drawCalls: 0,
      triangles: 0,
      objects: 0
    }
  }

  /**
   * Initialize the renderer - must be implemented by subclasses
   */
  initialize() {
    throw new Error('initialize() must be implemented by subclass')
  }

  /**
   * Render the scene - must be implemented by subclasses
   */
  render() {
    throw new Error('render() must be implemented by subclass')
  }

  /**
   * Clean up resources
   */
  dispose() {
    // Override in subclasses if needed
  }

  /**
   * Reset render statistics
   */
  resetStats() {
    this.renderStats = {
      drawCalls: 0,
      triangles: 0,
      objects: 0
    }
  }

  /**
   * Get render statistics
   */
  getStats() {
    return { ...this.renderStats }
  }

  /**
   * Create a framebuffer with color and depth attachments
   */
  createFramebuffer(colorAttachments = 1, useDepth = true) {
    const gl = this.gl
    const framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)

    const textures = []
    const drawBuffers = []

    // Create color attachments
    for (let i = 0; i < colorAttachments; i++) {
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, texture, 0)
      textures.push(texture)
      drawBuffers.push(gl.COLOR_ATTACHMENT0 + i)
    }

    // Set up draw buffers (only available in WebGL 2)
    if (drawBuffers.length > 0 && gl.drawBuffers) {
      gl.drawBuffers(drawBuffers)
    }

    // Create depth attachment if requested
    let depthTexture = null
    if (useDepth) {
      // Check if we're using WebGL 2 for better depth texture support
      const isWebGL2 = gl.getParameter(gl.VERSION).includes('WebGL 2')
      
      if (isWebGL2) {
        // WebGL 2: Use DEPTH_COMPONENT24
        depthTexture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, depthTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0)
      } else {
        // WebGL 1: Use renderbuffer for depth (more compatible)
        const depthBuffer = gl.createRenderbuffer()
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer)
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height)
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer)
        // Store the renderbuffer instead of texture for cleanup
        depthTexture = { renderbuffer: depthBuffer, isRenderbuffer: true }
      }
    }

    // Check framebuffer status
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(`Framebuffer incomplete: ${status}`)
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    return {
      framebuffer,
      textures,
      depthTexture,
      drawBuffers
    }
  }

  /**
   * Create a shader program
   */
  createShaderProgram(vertexSource, fragmentSource) {
    const gl = this.gl
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource)

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program)
      gl.deleteProgram(program)
      throw new Error(`Failed to link shader program: ${error}`)
    }

    return program
  }

  /**
   * Create a shader
   */
  createShader(type, source) {
    const gl = this.gl
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(`Failed to compile shader: ${error}`)
    }

    return shader
  }

  /**
   * Set viewport
   */
  setViewport(x = 0, y = 0, width = null, height = null) {
    const gl = this.gl
    width = width || this.width
    height = height || this.height
    gl.viewport(x, y, width, height)
  }

  /**
   * Clear the screen
   */
  clear(color = [0.1, 0.1, 0.15, 1.0]) {
    const gl = this.gl
    gl.clearColor(...color)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }
} 