import { m4 } from './math/matrix.js'
import Camera from './camera/camera.js'
import MeshMaker from './mesh/meshMaker.js'
import meshData from './mesh/meshData.js'

class Scene {
  constructor(gl, vertexShaderSource, fragmentShaderSource, perspective = true, mainObj, cylinder2) {
    this.gl = gl
    this.vertexShaderSource = vertexShaderSource
    this.fragmentShaderSource = fragmentShaderSource
    this.sceneTransform = m4.identityMatrix()
    this.objects = []
    this.perspective = perspective
    this.activeCamera = new Camera()
    this.flatShading = false
    this.mainObj = mainObj
    this.cylinder2 = cylinder2

    // Lighting setup
    this.lights = {
      directional: {
        direction: [-1, 1, -1], // Pointing away from light source (standard convention)
        color: [1.0, 1.0, 1.0],
        intensity: 1.0
      },
      pointLights: [
        { position: [200, 100, -200], color: [1.0, 0.8, 0.6], intensity: 0.8 },
        { position: [-200, 100, -200], color: [0.6, 0.8, 1.0], intensity: 0.6 },
        { position: [0, 200, -100], color: [1.0, 1.0, 0.8], intensity: 0.4 },
        { position: [0, -100, -300], color: [0.8, 1.0, 0.8], intensity: 0.3 }
      ]
    }

    // Material properties
    this.material = {
      shininess: 32.0,
      metallic: 0.0,
      roughness: 0.5
    }

    this.shaderProgram = this.initShaderProgram(this.gl, this.vertexShaderSource, this.fragmentShaderSource)

    // Get uniform locations
    this.cameraTransformLoc = this.gl.getUniformLocation(this.shaderProgram, 'cameraTransform')
    this.sceneTransformLoc = this.gl.getUniformLocation(this.shaderProgram, 'sceneTransform')
    this.projectionMatrixLoc = this.gl.getUniformLocation(this.shaderProgram, 'projectionMatrix')
    this.objectColorLoc = this.gl.getUniformLocation(this.shaderProgram, 'objectColor')
    this.flatShadingLoc = this.gl.getUniformLocation(this.shaderProgram, 'flatShading')
    
    // New lighting uniforms
    this.lightDirectionLoc = this.gl.getUniformLocation(this.shaderProgram, 'lightDirection')
    this.lightColorLoc = this.gl.getUniformLocation(this.shaderProgram, 'lightColor')
    this.ambientColorLoc = this.gl.getUniformLocation(this.shaderProgram, 'ambientColor')
    this.lightPositionsLoc = this.gl.getUniformLocation(this.shaderProgram, 'lightPositions')
    this.lightColorsLoc = this.gl.getUniformLocation(this.shaderProgram, 'lightColors')
    this.numLightsLoc = this.gl.getUniformLocation(this.shaderProgram, 'numLights')
    
    // Material uniforms
    this.shininessLoc = this.gl.getUniformLocation(this.shaderProgram, 'shininess')
    this.metallicLoc = this.gl.getUniformLocation(this.shaderProgram, 'metallic')
    this.roughnessLoc = this.gl.getUniformLocation(this.shaderProgram, 'roughness')

    // Set initial projection matrix
    this.setProjection(perspective)
  }

  setProjection(isPerspective) {
    this.perspective = isPerspective
    const aspect = this.gl.canvas.width / this.gl.canvas.height

    if (isPerspective) {
      this.projectionMatrix = m4.perspectiveProjection(90, aspect, 10, 5000)
    } else {
      const size = 25
      this.projectionMatrix = m4.orthographicProjection(-size * aspect, size * aspect, size, -size, -5000, 5000)
    }
  }

  add(object) {
    this.objects.push(object)
  }

  remove(object) {
    if (object.parent) {
      object.setParent(null) // Remove from parent's children
    }
    const index = this.objects.indexOf(object)
    if (index !== -1) {
      this.objects.splice(index, 1)
      console.log('removed', object)
    } else {
      console.warn('object not found in scene', object)
    }
  }

  toggleShadingMode() {
    this.flatShading = !this.flatShading
  }

  toggleWireframe() {
    for (const obj of this.objects) {
      if (obj.meshData?.toggleWireFrame) {
        obj.meshData.toggleWireFrame()
      }
      for (const child of obj.children || []) {
        if (child.meshData?.toggleWireFrame) {
          child.meshData.toggleWireFrame()
        }
      }
    }
  }

  addJSONObj(json, color = [0.6, 0.6, 0.6]) {
    const verts = json.vertices
    const uvs = json.uvs || null
    const pos = json.position || [0, 0, 0]
    const rot = json.rotation || [0, 0, 0]
    const scale = json.scale || [1, 1, 1]

    const mesh = new meshData(verts, uvs, color)
    const obj = MeshMaker.objectConstructor(mesh)
    obj.name = json.name || 'anonymous'
    obj.position = pos
    obj.rotation = rot
    obj.scaleTransform = scale

    this.add(obj)
    return obj
  }

  setActiveCamera(camera) {
    this.activeCamera = camera
  }

  // Update lighting uniforms
  updateLightingUniforms() {
    const gl = this.gl
    
    // Directional light
    const dirLight = this.lights.directional
    gl.uniform3fv(this.lightDirectionLoc, dirLight.direction)
    gl.uniform3fv(this.lightColorLoc, dirLight.color)
    gl.uniform3fv(this.ambientColorLoc, [0.2, 0.2, 0.2])
    
    // Point lights - ensure we always have 4 lights worth of data (12 values each)
    const positions = new Array(12).fill(0) // 4 lights × 3 components
    const colors = new Array(12).fill(0)    // 4 lights × 3 components
    
    for (let i = 0; i < Math.min(this.lights.pointLights.length, 4); i++) {
      const light = this.lights.pointLights[i]
      const baseIndex = i * 3
      positions[baseIndex] = light.position[0]
      positions[baseIndex + 1] = light.position[1]
      positions[baseIndex + 2] = light.position[2]
      colors[baseIndex] = light.color[0] * light.intensity
      colors[baseIndex + 1] = light.color[1] * light.intensity
      colors[baseIndex + 2] = light.color[2] * light.intensity
    }
    
    gl.uniform3fv(this.lightPositionsLoc, positions)
    gl.uniform3fv(this.lightColorsLoc, colors)
    gl.uniform1i(this.numLightsLoc, this.lights.pointLights.length)
    
    // Material properties
    gl.uniform1f(this.shininessLoc, this.material.shininess)
    gl.uniform1f(this.metallicLoc, this.material.metallic)
    gl.uniform1f(this.roughnessLoc, this.material.roughness)
  }

  render() {
    const gl = this.gl
    gl.clearColor(0.1, 0.1, 0.15, 1.0) // Darker background for better contrast
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)

    gl.useProgram(this.shaderProgram)

    let viewMatrix = this.activeCamera.getViewMatrix()
    viewMatrix = m4.multiply(this.activeCamera.rotation, viewMatrix)

    gl.uniformMatrix4fv(this.cameraTransformLoc, false, viewMatrix)
    gl.uniformMatrix4fv(this.sceneTransformLoc, false, this.sceneTransform)
    gl.uniformMatrix4fv(this.projectionMatrixLoc, false, this.projectionMatrix)

    gl.uniform1i(this.flatShadingLoc, this.flatShading ? 1 : 0)

    // Update lighting uniforms
    this.updateLightingUniforms()

    for (const obj of this.objects) {
      gl.uniform3fv(this.objectColorLoc, obj.meshData.color)
      
      // Apply per-object material properties if available
      if (obj.material) {
        gl.uniform1f(this.shininessLoc, obj.material.shininess || this.material.shininess)
        gl.uniform1f(this.metallicLoc, obj.material.metallic || this.material.metallic)
        gl.uniform1f(this.roughnessLoc, obj.material.roughness || this.material.roughness)
      } else {
        // Use default material properties
        gl.uniform1f(this.shininessLoc, this.material.shininess)
        gl.uniform1f(this.metallicLoc, this.material.metallic)
        gl.uniform1f(this.roughnessLoc, this.material.roughness)
      }
      
      obj.draw(gl, this.shaderProgram, viewMatrix)
    }
  }

  initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
      return null
    }

    gl.useProgram(shaderProgram)
    const flatShadingLoc = gl.getUniformLocation(shaderProgram, 'flatShading')
    gl.uniform1i(flatShadingLoc, 0)

    return shaderProgram
  }

  loadShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }
}

export default Scene
