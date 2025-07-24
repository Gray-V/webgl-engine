// projectedShadow.vert.js
export default `#version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_normal;

uniform mat4 u_world;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_textureMatrix;

out vec3 v_normal;
out vec4 v_projectedTexcoord;

void main() {
  vec4 worldPos = u_world * vec4(a_position, 1.0);
  gl_Position = u_projection * u_view * worldPos;

  v_normal = mat3(u_world) * a_normal;
  v_projectedTexcoord = u_textureMatrix * worldPos;
}
`;
