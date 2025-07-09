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

void main(void) {
  mat4 modelView = cameraTransform * sceneTransform * objectTransform;
  vec4 worldPos = modelView * vec4(vertexPosition, 1.0);
  gl_Position = projectionMatrix * modelView * vec4(vertexPosition, 1.0);

  vNormal = normalize(normalMatrix * vertexNormal);
  if (flatShading){
    vNormal = normalize(mat3(modelView) * vertexNormal);
  }

  if (clockwise) {
    vNormal = -vNormal;
  }

  vFragPos = worldPos.xyz;

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

uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform bool showNormals;
uniform bool flatShading;

void main(void) {

  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(lightDirection);

  float diffuse = max(dot(-normal, lightDir), 0.0);

  vec3 litColor = ambientColor + diffuse * lightColor;

  vec3 finalColor = vColor * litColor;

  if (showNormals) {
    finalColor = normal * 0.5 + 0.5; // Remap normal [-1,1] to [0,1] for debug
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
`
