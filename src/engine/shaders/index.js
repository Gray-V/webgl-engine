// Main lighting shaders (used by most scenes)
export const VERTEX_SHADER = `
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
  // Compose model-view matrix (column-major, right-handed)
  mat4 modelView = cameraTransform * sceneTransform * objectTransform;
  vec4 worldPos = modelView * vec4(vertexPosition, 1.0);
  gl_Position = projectionMatrix * modelView * vec4(vertexPosition, 1.0);

  // Normal in world space
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
`;

export const FRAGMENT_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vFragPos;
varying vec3 vWorldPos;

uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform bool showNormals;

// Material properties
uniform float shininess;
uniform float metallic;
uniform float roughness;

// Multiple light sources
uniform vec3 lightPositions[4];
uniform vec3 lightColors[4];
uniform int numLights;

void main(void) {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vFragPos); // Camera at origin in view space

  // Show normals debug
  if (showNormals) {
    gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
    return;
  }

  // Ambient only path: if all lights are zero, output only ambient
  bool noLights = all(lessThan(lightColor, vec3(0.0001))) && numLights == 0;
  if (noLights) {
    gl_FragColor = vec4(vColor * ambientColor, 1.0);
    return;
  }

  // --- Lighting ---
  vec3 ambient = ambientColor;
  vec3 diffuse = vec3(0.0);
  vec3 specular = vec3(0.0);

  // Directional light
  vec3 dir = normalize(lightDirection);
  float diff = max(dot(normal, dir), 0.0);
  diffuse += diff * lightColor;
  // Specular for main light
  vec3 reflectDir = reflect(-dir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
  specular += spec * lightColor;

  // Point lights
  for (int i = 0; i < 4; i++) {
    if (i >= numLights) break;
    vec3 lp = lightPositions[i];
    vec3 lc = lightColors[i];
    vec3 lightDir = normalize(lp - vFragPos);
    float distance = length(lp - vFragPos);
    float attenuation = 1.0 / (1.0 + 0.09 * distance + 0.032 * distance * distance);
    float diff = max(dot(normal, lightDir), 0.0);
    diffuse += diff * lc * attenuation;
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    specular += spec * lc * attenuation;
  }

  // Fresnel effect for metallic
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 5.0);
  vec3 fresnelColor = mix(vec3(0.04), vColor, metallic);
  specular += fresnel * fresnelColor;

  // Combine
  vec3 litColor = ambient + diffuse + specular;
  vec3 finalColor = vColor * litColor;

  // Rim lighting for shape definition
  float rim = 1.0 - max(dot(normal, viewDir), 0.0);
  rim = pow(rim, 4.0);
  finalColor += rim * 0.2 * vColor;

  // Gamma correction
  finalColor = pow(finalColor, vec3(1.0 / 2.2));

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// GLTF shaders (used by GLTFModelScene)
export const GLTF_VERTEX_SHADER = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 uProjection;
  uniform mat4 uView;
  varying vec2 vUv;
  void main() {
    gl_Position = uProjection * uView * vec4(position, 1.0);
    vUv = uv;
  }
`;

export const GLTF_FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform bool uHasTexture;
  void main() {
    if (uHasTexture) {
      gl_FragColor = texture2D(uTexture, vUv);
    } else {
      gl_FragColor = vec4(1, 1, 1, 1);
    }
  }
`;

// Deferred rendering shaders (used by DeferredRenderer)
export const DEFERRED_GBUFFER_VERTEX_SHADER_WEBGL2 = `#version 300 es
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
`;

export const DEFERRED_GBUFFER_FRAGMENT_SHADER_WEBGL2 = `#version 300 es
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
`;

export const DEFERRED_GBUFFER_VERTEX_SHADER_WEBGL1 = `
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
`;

export const DEFERRED_GBUFFER_FRAGMENT_SHADER_WEBGL1 = `
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
`;

export const DEFERRED_LIGHTING_VERTEX_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec2 position;

varying vec2 vTexCoord;

void main(void) {
  vTexCoord = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const DEFERRED_LIGHTING_FRAGMENT_SHADER_WEBGL2 = `
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
`;

export const DEFERRED_LIGHTING_FRAGMENT_SHADER_WEBGL1 = `
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
`; 