import { BaseRenderer } from './BaseRenderer.js'
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../shaders/helpers.js'
import { m4 } from '../math/matrix.js'

/**
 * Forward Renderer - Traditional rendering approach
 * Renders objects directly to the screen with lighting calculated per-fragment
 * 
 * Pros:
 * - Simple to implement
 * - Good for scenes with few lights
 * - Lower memory usage
 * 
 * Cons:
 * - Performance degrades with many lights
 * - Can't easily add post-processing effects
 * - Overdraw issues with transparent objects
 */
export class ForwardRenderer extends BaseRenderer {
  constructor(gl, scene) {
    super(gl, scene)
    this.shaderProgram = null
    this.uniforms = {}
  }

  initialize() {
    const gl = this.gl
    
    // Create shader program
    this.shaderProgram = this.createShaderProgram(VERTEX_SHADER, FRAGMENT_SHADER)
    
    // Get uniform locations
    this.uniforms = {
      cameraTransform: gl.getUniformLocation(this.shaderProgram, 'cameraTransform'),
      sceneTransform: gl.getUniformLocation(this.shaderProgram, 'sceneTransform'),
      projectionMatrix: gl.getUniformLocation(this.shaderProgram, 'projectionMatrix'),
      objectColor: gl.getUniformLocation(this.shaderProgram, 'objectColor'),
      flatShading: gl.getUniformLocation(this.shaderProgram, 'flatShading'),
      lightDirection: gl.getUniformLocation(this.shaderProgram, 'lightDirection'),
      lightColor: gl.getUniformLocation(this.shaderProgram, 'lightColor'),
      ambientColor: gl.getUniformLocation(this.shaderProgram, 'ambientColor'),
      lightPositions: gl.getUniformLocation(this.shaderProgram, 'lightPositions'),
      lightColors: gl.getUniformLocation(this.shaderProgram, 'lightColors'),
      numLights: gl.getUniformLocation(this.shaderProgram, 'numLights'),
      shininess: gl.getUniformLocation(this.shaderProgram, 'shininess'),
      metallic: gl.getUniformLocation(this.shaderProgram, 'metallic'),
      roughness: gl.getUniformLocation(this.shaderProgram, 'roughness')
    }

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    
    this.isInitialized = true
  }

  render() {
    if (!this.isInitialized) {
      throw new Error('ForwardRenderer not initialized. Call initialize() first.')
    }

    const gl = this.gl
    const scene = this.scene
    
    // Reset stats
    this.resetStats()
    
    // Clear the screen
    this.clear()
    
    // Use the shader program
    gl.useProgram(this.shaderProgram)
    
    // Get camera and projection matrices
    const viewMatrix = scene.activeCamera.getViewMatrix()
    const viewMatrixWithRotation = m4.multiply(scene.activeCamera.rotation, viewMatrix)
    
    // Set common uniforms
    gl.uniformMatrix4fv(this.uniforms.cameraTransform, false, viewMatrixWithRotation)
    gl.uniformMatrix4fv(this.uniforms.sceneTransform, false, scene.sceneTransform)
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, scene.projectionMatrix)
    gl.uniform1i(this.uniforms.flatShading, scene.flatShading ? 1 : 0)
    
    // Update lighting uniforms
    this.updateLightingUniforms()
    
    // Render all objects
    for (const obj of scene.objects) {
      this.renderObject(obj, viewMatrixWithRotation)
    }
  }

  renderObject(obj, viewMatrix) {
    const gl = this.gl
    
    // Set object-specific uniforms
    gl.uniform3fv(this.uniforms.objectColor, obj.meshData.color)
    
    // Apply per-object material properties if available
    if (obj.material) {
      gl.uniform1f(this.uniforms.shininess, obj.material.shininess || this.scene.material.shininess)
      gl.uniform1f(this.uniforms.metallic, obj.material.metallic || this.scene.material.metallic)
      gl.uniform1f(this.uniforms.roughness, obj.material.roughness || this.scene.material.roughness)
    } else {
      gl.uniform1f(this.uniforms.shininess, this.scene.material.shininess)
      gl.uniform1f(this.uniforms.metallic, this.scene.material.metallic)
      gl.uniform1f(this.uniforms.roughness, this.scene.material.roughness)
    }
    
    // Render the object
    this.drawObject(obj, viewMatrix)
    
    // Update stats
    this.renderStats.objects++
    this.renderStats.drawCalls++
    this.renderStats.triangles += obj.meshData.verts.length / 9 // Assuming triangles
  }

  drawObject(obj, viewMatrix) {
    const gl = this.gl
    
    if (!obj.meshData) return

    // Set up vertex attributes
    const posLoc = gl.getAttribLocation(this.shaderProgram, 'vertexPosition')
    const normLoc = gl.getAttribLocation(this.shaderProgram, 'vertexNormal')

    if (posLoc !== -1) {
      const posBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.meshData.verts), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
    }

    if (normLoc !== -1 && obj.meshData.normals) {
      const normBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.meshData.normals), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(normLoc)
      gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0)
    }

    // Calculate and set transform matrices
    const transform = obj.getWorldTransform()
    const normalMatrix4 = m4.transpose(m4.inverse(transform))
    const normalMatrix = [
      normalMatrix4[0], normalMatrix4[1], normalMatrix4[2],
      normalMatrix4[4], normalMatrix4[5], normalMatrix4[6],
      normalMatrix4[8], normalMatrix4[9], normalMatrix4[10]
    ]

    gl.uniformMatrix3fv(gl.getUniformLocation(this.shaderProgram, 'normalMatrix'), false, normalMatrix)
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, 'objectTransform'), false, transform)

    // Set object-specific flags
    gl.uniform1i(gl.getUniformLocation(this.shaderProgram, 'showNormals'), obj.meshData.showNormals)
    gl.uniform1i(gl.getUniformLocation(this.shaderProgram, 'clockwise'), obj.meshData.clockwise)

    // Draw the object
    const drawMode = obj.meshData.isWireFrame ? gl.LINES : gl.TRIANGLES
    gl.drawArrays(drawMode, 0, obj.meshData.verts.length / 3)

    // Render children recursively
    for (const child of obj.children) {
      this.drawObject(child, viewMatrix)
    }
  }

  updateLightingUniforms() {
    const gl = this.gl
    const scene = this.scene
    
    // Directional light
    const dirLight = scene.lights.directional
    gl.uniform3fv(this.uniforms.lightDirection, dirLight.direction)
    gl.uniform3fv(this.uniforms.lightColor, dirLight.color)
    gl.uniform3fv(this.uniforms.ambientColor, [0.2, 0.2, 0.2])
    
    // Point lights
    const positions = []
    const colors = []
    for (let i = 0; i < scene.lights.pointLights.length; i++) {
      const light = scene.lights.pointLights[i]
      positions.push(...light.position)
      colors.push(light.color[0] * light.intensity, light.color[1] * light.intensity, light.color[2] * light.intensity)
    }
    
    gl.uniform3fv(this.uniforms.lightPositions, positions)
    gl.uniform3fv(this.uniforms.lightColors, colors)
    gl.uniform1i(this.uniforms.numLights, scene.lights.pointLights.length)
  }

  dispose() {
    const gl = this.gl
    if (this.shaderProgram) {
      gl.deleteProgram(this.shaderProgram)
      this.shaderProgram = null
    }
  }
} 