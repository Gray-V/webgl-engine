// projectedShadow.frag.js
export default `#version 300 es
precision highp float;

in vec3 v_normal;
in vec4 v_projectedTexcoord;

uniform sampler2D u_projectedTexture;
uniform float u_bias;
uniform bool u_lightEnabled;
uniform vec3 u_reverseLightDirection;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  float light = max(dot(normal, u_reverseLightDirection), 0.0);

  vec3 projTexCoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
  bool inRange = 
    projTexCoord.x >= 0.0 && projTexCoord.x <= 1.0 &&
    projTexCoord.y >= 0.0 && projTexCoord.y <= 1.0;

  float currentDepth = projTexCoord.z + u_bias;
  float shadowDepth = texture(u_projectedTexture, projTexCoord.xy).r;

  float shadow = inRange && shadowDepth < currentDepth ? 0.5 : 1.0;

  vec3 baseColor = vec3(1.0, 0.8, 0.6); // sample color
  vec3 litColor = baseColor * light * shadow;

  outColor = vec4(u_lightEnabled ? litColor : baseColor, 1.0);
}
`;
