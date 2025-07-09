import { m4 } from './matrix.js'
import Camera from './camera.js'
import MeshMaker from './meshMaker.js'
import meshData from './meshData.js'

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

    this.shaderProgram = this.initShaderProgram(this.gl, this.vertexShaderSource, this.fragmentShaderSource)

    this.cameraTransformLoc = this.gl.getUniformLocation(this.shaderProgram, 'cameraTransform')
    this.sceneTransformLoc = this.gl.getUniformLocation(this.shaderProgram, 'sceneTransform')
    this.projectionMatrixLoc = this.gl.getUniformLocation(this.shaderProgram, 'projectionMatrix')
    this.objectColorLoc = this.gl.getUniformLocation(this.shaderProgram, 'objectColor')
    this.flatShadingLoc = this.gl.getUniformLocation(this.shaderProgram, 'flatShading')

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

  render() {
    const gl = this.gl
    gl.clearColor(0.8, 0.8, 0.8, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)

    gl.useProgram(this.shaderProgram)

    let viewMatrix = this.activeCamera.getViewMatrix()
    viewMatrix = m4.multiply(this.activeCamera.rotation, viewMatrix)

    gl.uniformMatrix4fv(this.cameraTransformLoc, false, viewMatrix)
    gl.uniformMatrix4fv(this.sceneTransformLoc, false, this.sceneTransform)
    gl.uniformMatrix4fv(this.projectionMatrixLoc, false, this.projectionMatrix)

    gl.uniform1i(this.flatShadingLoc, this.flatShading ? 1 : 0)

    for (const obj of this.objects) {
      gl.uniform3fv(this.objectColorLoc, obj.meshData.color)
      obj.draw(gl, this.shaderProgram, viewMatrix)
      // console.log("rendering:", obj.name || obj)
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
