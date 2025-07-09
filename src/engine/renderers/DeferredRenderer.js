import { BaseRenderer } from './BaseRenderer.js'
import { m4 } from '../matrix.js'

/**
 * Deferred Renderer - Modern rendering approach
 * First pass: Render geometry data to G-buffer textures
 * Second pass: Apply lighting using the G-buffer data
 * 
 * Pros:
 * - Scales well with many lights
 * - Easy to add post-processing effects
 * - Better performance with complex lighting
 * 
 * Cons:
 * - Higher memory usage
 * - More complex to implement
 * - Can't handle transparency easily
 */

// G-Buffer vertex shader for WebGL2
const GBUFFER_VERTEX_SHADER_WEBGL2 = `#version 300 es
precision highp float;

in vec3 vertexPosition;
in vec3 vertexNormal;

uniform mat4 cameraTransform;
uniform mat4 sceneTransform;
uniform mat4 objectTransform;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform vec3 objectColor;
uniform bool showNormals;
uniform bool clockwise;
uniform bool flatShading;

out vec3 vColor;
out vec3 vNormal;
out vec3 vFragPos;
out vec3 vWorldPos;

void main(void) {
  mat4 modelView = cameraTransform * sceneTransform * objectTransform;
  vec4 worldPos = modelView * vec4(vertexPosition, 1.0);
  gl_Position = projectionMatrix * modelView * vec4(vertexPosition, 1.0);

  vNormal = normalize(normalMatrix * vertexNormal);
  if (flatShading) {
    vNormal = normalize(mat3(modelView) * vertexNormal);
  }

  if (clockwise) {
    vNormal = -vNormal;
  }

  vFragPos = worldPos.xyz;
  vWorldPos = worldPos.xyz;

  if (showNormals) {
    vColor = vNormal * 0.5 + 0.5;
  } else {
    vColor = objectColor;
  }
}
`

// G-Buffer fragment shader - outputs to multiple render targets (WebGL 2)
const GBUFFER_FRAGMENT_SHADER_WEBGL2 = `#version 300 es
precision highp float;

in vec3 vColor;
in vec3 vNormal;
in vec3 vFragPos;
in vec3 vWorldPos;

uniform float shininess;
uniform float metallic;
uniform float roughness;

layout(location = 0) out vec4 outAlbedo;
layout(location = 1) out vec4 outNormal;
layout(location = 2) out vec4 outPosition;
layout(location = 3) out vec4 outMaterial;

void main(void) {
  outAlbedo = vec4(vColor, 1.0);
  vec3 normal = normalize(vNormal);
  outNormal = vec4(normal * 0.5 + 0.5, 1.0);
  outPosition = vec4(vFragPos, 1.0);
  outMaterial = vec4(shininess / 256.0, metallic, roughness, 1.0);
}
`

// G-Buffer vertex shader for WebGL1 (unchanged)
const GBUFFER_VERTEX_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertexPosition;
attribute vec3 vertexNormal;

uniform mat4 cameraTransform;
uniform mat4 sceneTransform;
uniform mat4 objectTransform;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform vec3 objectColor;
uniform bool showNormals;
uniform bool clockwise;
uniform bool flatShading;

varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vFragPos;
varying vec3 vWorldPos;

void main(void) {
  mat4 modelView = cameraTransform * sceneTransform * objectTransform;
  vec4 worldPos = modelView * vec4(vertexPosition, 1.0);
  gl_Position = projectionMatrix * modelView * vec4(vertexPosition, 1.0);

  vNormal = normalize(normalMatrix * vertexNormal);
  if (flatShading) {
    vNormal = normalize(mat3(modelView) * vertexNormal);
  }

  if (clockwise) {
    vNormal = -vNormal;
  }

  vFragPos = worldPos.xyz;
  vWorldPos = worldPos.xyz;

  if (showNormals) {
    vColor = vNormal * 0.5 + 0.5;
  } else {
    vColor = objectColor;
  }
}
`

// Simplified G-Buffer fragment shader for WebGL 1
const GBUFFER_FRAGMENT_SHADER_WEBGL1 = `
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vFragPos;
varying vec3 vWorldPos;

uniform float shininess;
uniform float metallic;
uniform float roughness;

void main(void) {
  // For WebGL 1, we'll pack some data into the single output
  vec3 normal = normalize(vNormal);
  gl_FragColor = vec4(vColor, 1.0);
}
`

// Lighting vertex shader (full-screen quad)
const LIGHTING_VERTEX_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec2 position;

varying vec2 vTexCoord;

void main(void) {
  vTexCoord = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

// Lighting fragment shader for WebGL2 (full G-buffer)
const LIGHTING_FRAGMENT_SHADER_WEBGL2 = `
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;

uniform sampler2D albedoTexture;
uniform sampler2D normalTexture;
uniform sampler2D positionTexture;
uniform sampler2D materialTexture;

uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPositions[4];
uniform vec3 lightColors[4];
uniform int numLights;
uniform vec3 cameraPosition;

void main(void) {
  vec4 albedo = texture2D(albedoTexture, vTexCoord);
  vec3 normal = texture2D(normalTexture, vTexCoord).rgb * 2.0 - 1.0;
  vec3 position = texture2D(positionTexture, vTexCoord).xyz;
  vec3 material = texture2D(materialTexture, vTexCoord).rgb;
  float shininess = material.r * 256.0;
  float metallic = material.g;
  float roughness = material.b;

  if (albedo.a < 0.1) {
    gl_FragColor = vec4(ambientColor, 1.0);
    return;
  }

  vec3 viewDir = normalize(cameraPosition - position);
  vec3 ambient = ambientColor * 0.3;
  vec3 diffuse = vec3(0.0);
  vec3 specular = vec3(0.0);

  vec3 lightDir = normalize(lightDirection);
  float diff = max(dot(normal, -lightDir), 0.0);
  diffuse += diff * lightColor;

  vec3 reflectDir = reflect(lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
  specular += spec * lightColor;

  for (int i = 0; i < 4; i++) {
    if (i >= numLights) break;
    vec3 lightDir = normalize(lightPositions[i] - position);
    float distance = length(lightPositions[i] - position);
    float attenuation = 1.0 / (1.0 + 0.09 * distance + 0.032 * distance * distance);
    float diff = max(dot(normal, lightDir), 0.0);
    diffuse += diff * lightColors[i] * attenuation;
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    specular += spec * lightColors[i] * attenuation;
  }

  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 5.0);
  vec3 fresnelColor = mix(vec3(0.04), albedo.rgb, metallic);
  specular += fresnel * fresnelColor;

  vec3 litColor = ambient + diffuse + specular;
  vec3 finalColor = albedo.rgb * litColor;
  float rim = 1.0 - max(dot(normal, viewDir), 0.0);
  rim = pow(rim, 4.0);
  finalColor += rim * 0.2 * albedo.rgb;
  finalColor = pow(finalColor, vec3(1.0 / 2.2));
  gl_FragColor = vec4(finalColor, 1.0);
}
`

// Lighting fragment shader for WebGL1 (fallback)
const LIGHTING_FRAGMENT_SHADER_WEBGL1 = `
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;

uniform sampler2D albedoTexture;
uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPositions[4];
uniform vec3 lightColors[4];
uniform int numLights;
uniform vec3 cameraPosition;

void main(void) {
  vec4 albedo = texture2D(albedoTexture, vTexCoord);
  vec3 normal = vec3(0.0, 0.0, 1.0);
  vec3 position = vec3(0.0, 0.0, 0.0);
  float shininess = 32.0;
  float metallic = 0.0;
  float roughness = 0.5;

  if (albedo.a < 0.1) {
    gl_FragColor = vec4(ambientColor, 1.0);
    return;
  }

  vec3 viewDir = normalize(cameraPosition - position);
  vec3 ambient = ambientColor * 0.5;
  vec3 diffuse = vec3(0.0);
  vec3 specular = vec3(0.0);

  vec3 lightDir = normalize(lightDirection);
  float diff = max(dot(normal, -lightDir), 0.0);
  diffuse += diff * lightColor;

  vec3 reflectDir = reflect(lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
  specular += spec * lightColor;

  for (int i = 0; i < 4; i++) {
    if (i >= numLights) break;
    vec3 lightDir = normalize(lightPositions[i] - position);
    float distance = length(lightPositions[i] - position);
    float attenuation = 1.0 / (1.0 + 0.09 * distance + 0.032 * distance * distance);
    float diff = max(dot(normal, lightDir), 0.0);
    diffuse += diff * lightColors[i] * attenuation;
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    specular += spec * lightColors[i] * attenuation;
  }

  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 5.0);
  vec3 fresnelColor = mix(vec3(0.04), albedo.rgb, metallic);
  specular += fresnel * fresnelColor;

  vec3 litColor = ambient + diffuse + specular;
  vec3 finalColor = albedo.rgb * litColor;
  float rim = 1.0 - max(dot(normal, viewDir), 0.0);
  rim = pow(rim, 4.0);
  finalColor += rim * 0.2 * albedo.rgb;
  finalColor = pow(finalColor, vec3(1.0 / 2.2));
  gl_FragColor = vec4(finalColor, 1.0);
}
`

export class DeferredRenderer extends BaseRenderer {
  constructor(gl, scene) {
    super(gl, scene)
    this.gBufferProgram = null
    this.lightingProgram = null
    this.gBuffer = null
    this.quadBuffer = null
    this.uniforms = {}
  }

  initialize() {
    const gl = this.gl
    
    // Check if WebGL 2 is available for multiple render targets
    this.isWebGL2 = gl.getParameter(gl.VERSION).includes('WebGL 2')
    let supportsMRT = false

    if (this.isWebGL2 && typeof gl.drawBuffers === 'function') {
      const maxColorAttachments = gl.getParameter(gl.MAX_COLOR_ATTACHMENTS);
      if (maxColorAttachments >= 4) {
        supportsMRT = true;
      }
    }

    if (this.isWebGL2 && supportsMRT) {
      this.gBuffer = this.createFramebuffer(4, true)
    } else {
      console.warn('Multiple Render Targets not supported. Using simplified deferred rendering.')
      this.gBuffer = this.createFramebuffer(1, true)
      this.isWebGL2 = false // force fallback path for shaders
    }
    
    // Create shader programs
    let gBufferVertexShader, gBufferFragmentShader;
    if (this.isWebGL2) {
      gBufferVertexShader = GBUFFER_VERTEX_SHADER_WEBGL2;
      gBufferFragmentShader = GBUFFER_FRAGMENT_SHADER_WEBGL2;
      this.lightingProgram = this.createShaderProgram(LIGHTING_VERTEX_SHADER, LIGHTING_FRAGMENT_SHADER_WEBGL2);
    } else {
      gBufferVertexShader = GBUFFER_VERTEX_SHADER;
      gBufferFragmentShader = GBUFFER_FRAGMENT_SHADER_WEBGL1;
      this.lightingProgram = this.createShaderProgram(LIGHTING_VERTEX_SHADER, LIGHTING_FRAGMENT_SHADER_WEBGL1);
    }
    this.gBufferProgram = this.createShaderProgram(gBufferVertexShader, gBufferFragmentShader);
    
    // Get uniform locations for G-buffer pass
    this.uniforms = {
      // G-buffer uniforms
      cameraTransform: gl.getUniformLocation(this.gBufferProgram, 'cameraTransform'),
      sceneTransform: gl.getUniformLocation(this.gBufferProgram, 'sceneTransform'),
      projectionMatrix: gl.getUniformLocation(this.gBufferProgram, 'projectionMatrix'),
      objectColor: gl.getUniformLocation(this.gBufferProgram, 'objectColor'),
      flatShading: gl.getUniformLocation(this.gBufferProgram, 'flatShading'),
      shininess: gl.getUniformLocation(this.gBufferProgram, 'shininess'),
      metallic: gl.getUniformLocation(this.gBufferProgram, 'metallic'),
      roughness: gl.getUniformLocation(this.gBufferProgram, 'roughness'),
      
      // Lighting uniforms
      albedoTexture: gl.getUniformLocation(this.lightingProgram, 'albedoTexture'),
      normalTexture: gl.getUniformLocation(this.lightingProgram, 'normalTexture'),
      positionTexture: gl.getUniformLocation(this.lightingProgram, 'positionTexture'),
      materialTexture: gl.getUniformLocation(this.lightingProgram, 'materialTexture'),
      lightDirection: gl.getUniformLocation(this.lightingProgram, 'lightDirection'),
      lightColor: gl.getUniformLocation(this.lightingProgram, 'lightColor'),
      ambientColor: gl.getUniformLocation(this.lightingProgram, 'ambientColor'),
      lightPositions: gl.getUniformLocation(this.lightingProgram, 'lightPositions'),
      lightColors: gl.getUniformLocation(this.lightingProgram, 'lightColors'),
      numLights: gl.getUniformLocation(this.lightingProgram, 'numLights'),
      cameraPosition: gl.getUniformLocation(this.lightingProgram, 'cameraPosition')
    }

    // Create full-screen quad for lighting pass
    this.createQuad()
    
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    
    this.isInitialized = true
  }

  createQuad() {
    const gl = this.gl
    const quadVertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0
    ])
    
    this.quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW)
  }

  render() {
    if (!this.isInitialized) {
      throw new Error('DeferredRenderer not initialized. Call initialize() first.')
    }

    const gl = this.gl
    const scene = this.scene
    
    // Reset stats
    this.resetStats()
    
    // Pass 1: Geometry pass - render to G-buffer
    this.renderGeometryPass()
    
    // Pass 2: Lighting pass - render to screen
    this.renderLightingPass()
  }

  renderGeometryPass() {
    const gl = this.gl
    const scene = this.scene
    
    // Bind G-buffer framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.gBuffer.framebuffer)
    
    // Set draw buffers only if WebGL 2 is available
    if (this.isWebGL2 && this.gBuffer.drawBuffers) {
      gl.drawBuffers(this.gBuffer.drawBuffers)
    }
    
    // Clear G-buffer
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    // Use G-buffer shader program
    gl.useProgram(this.gBufferProgram)
    
    // Get camera and projection matrices
    const viewMatrix = scene.activeCamera.getViewMatrix()
    const viewMatrixWithRotation = m4.multiply(scene.activeCamera.rotation, viewMatrix)
    
    // Set common uniforms
    gl.uniformMatrix4fv(this.uniforms.cameraTransform, false, viewMatrixWithRotation)
    gl.uniformMatrix4fv(this.uniforms.sceneTransform, false, scene.sceneTransform)
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, scene.projectionMatrix)
    gl.uniform1i(this.uniforms.flatShading, scene.flatShading ? 1 : 0)
    
    // Render all objects to G-buffer
    for (const obj of scene.objects) {
      this.renderObjectToGBuffer(obj, viewMatrixWithRotation)
    }
  }

  renderObjectToGBuffer(obj, viewMatrix) {
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
    this.drawObjectToGBuffer(obj, viewMatrix)
    
    // Update stats
    this.renderStats.objects++
    this.renderStats.drawCalls++
    this.renderStats.triangles += obj.meshData.verts.length / 9
  }

  drawObjectToGBuffer(obj, viewMatrix) {
    const gl = this.gl
    
    if (!obj.meshData) return

    // Set up vertex attributes
    const posLoc = gl.getAttribLocation(this.gBufferProgram, 'vertexPosition')
    const normLoc = gl.getAttribLocation(this.gBufferProgram, 'vertexNormal')

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

    gl.uniformMatrix3fv(gl.getUniformLocation(this.gBufferProgram, 'normalMatrix'), false, normalMatrix)
    gl.uniformMatrix4fv(gl.getUniformLocation(this.gBufferProgram, 'objectTransform'), false, transform)

    // Set object-specific flags
    gl.uniform1i(gl.getUniformLocation(this.gBufferProgram, 'showNormals'), obj.meshData.showNormals)
    gl.uniform1i(gl.getUniformLocation(this.gBufferProgram, 'clockwise'), obj.meshData.clockwise)

    // Draw the object
    const drawMode = obj.meshData.isWireFrame ? gl.LINES : gl.TRIANGLES
    gl.drawArrays(drawMode, 0, obj.meshData.verts.length / 3)

    // Render children recursively
    for (const child of obj.children) {
      this.drawObjectToGBuffer(child, viewMatrix)
    }
  }

  renderLightingPass() {
    const gl = this.gl
    const scene = this.scene
    
    // Bind default framebuffer (screen)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    
    // Clear screen
    this.clear()
    
    // Disable depth testing for lighting pass
    gl.disable(gl.DEPTH_TEST)
    
    // Use lighting shader program
    gl.useProgram(this.lightingProgram)
    
    // Bind G-buffer textures
    if (this.isWebGL2) {
      // Full deferred rendering with multiple render targets
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this.gBuffer.textures[0]) // Albedo
      gl.uniform1i(this.uniforms.albedoTexture, 0)
      
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, this.gBuffer.textures[1]) // Normal
      gl.uniform1i(this.uniforms.normalTexture, 1)
      
      gl.activeTexture(gl.TEXTURE2)
      gl.bindTexture(gl.TEXTURE_2D, this.gBuffer.textures[2]) // Position
      gl.uniform1i(this.uniforms.positionTexture, 2)
      
      gl.activeTexture(gl.TEXTURE3)
      gl.bindTexture(gl.TEXTURE_2D, this.gBuffer.textures[3]) // Material
      gl.uniform1i(this.uniforms.materialTexture, 3)
    } else {
      // Simplified deferred rendering for WebGL 1
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this.gBuffer.textures[0]) // Combined data
      gl.uniform1i(this.uniforms.albedoTexture, 0)
      
      // Use default values for other textures
      gl.uniform1i(this.uniforms.normalTexture, 0)
      gl.uniform1i(this.uniforms.positionTexture, 0)
      gl.uniform1i(this.uniforms.materialTexture, 0)
    }
    
    // Set lighting uniforms
    this.updateLightingUniforms()
    
    // Set camera position
    gl.uniform3fv(this.uniforms.cameraPosition, scene.activeCamera.position)
    
    // Render full-screen quad
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    const posLoc = gl.getAttribLocation(this.lightingProgram, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    
    // Re-enable depth testing
    gl.enable(gl.DEPTH_TEST)
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
    
    if (this.gBufferProgram) {
      gl.deleteProgram(this.gBufferProgram)
      this.gBufferProgram = null
    }
    
    if (this.lightingProgram) {
      gl.deleteProgram(this.lightingProgram)
      this.lightingProgram = null
    }
    
    if (this.gBuffer) {
      gl.deleteFramebuffer(this.gBuffer.framebuffer)
      this.gBuffer.textures.forEach(texture => gl.deleteTexture(texture))
      if (this.gBuffer.depthTexture) {
        if (this.gBuffer.depthTexture.isRenderbuffer) {
          gl.deleteRenderbuffer(this.gBuffer.depthTexture.renderbuffer)
        } else {
          gl.deleteTexture(this.gBuffer.depthTexture)
        }
      }
    }
    
    if (this.quadBuffer) {
      gl.deleteBuffer(this.quadBuffer)
    }
  }
} 