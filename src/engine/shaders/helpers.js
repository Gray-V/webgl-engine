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

// Additional shader for wireframe rendering
export const WIREFRAME_VERTEX_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertexPosition;

uniform mat4 cameraTransform;
uniform mat4 sceneTransform;
uniform mat4 objectTransform;
uniform mat4 projectionMatrix;

void main(void) {
  mat4 modelView = cameraTransform * sceneTransform * objectTransform;
  gl_Position = projectionMatrix * modelView * vec4(vertexPosition, 1.0);
}
`;

export const WIREFRAME_FRAGMENT_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec3 wireframeColor;

void main(void) {
  gl_FragColor = vec4(wireframeColor, 1.0);
}
`;

// Shader for unlit objects (useful for UI elements)
export const UNLIT_VERTEX_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertexPosition;

uniform mat4 cameraTransform;
uniform mat4 sceneTransform;
uniform mat4 objectTransform;
uniform mat4 projectionMatrix;

varying vec3 vColor;

void main(void) {
  mat4 modelView = cameraTransform * sceneTransform * objectTransform;
  gl_Position = projectionMatrix * modelView * vec4(vertexPosition, 1.0);
  vColor = vec3(1.0, 1.0, 1.0);
}
`;

export const UNLIT_FRAGMENT_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;

void main(void) {
  gl_FragColor = vec4(vColor, 1.0);
}
`;
