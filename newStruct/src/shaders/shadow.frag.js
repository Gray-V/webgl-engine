export default `#version 300 es
precision highp float;

in vec3 v_normal;
in vec4 v_worldPosition;
in vec4 v_shadowCoord;

uniform vec3 u_reverseLightDirection;
uniform sampler2D u_projectedTexture;
uniform float u_bias;
uniform bool u_lightEnabled;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  float light = max(dot(normal, normalize(u_reverseLightDirection)), 0.0);

  vec3 projCoord = v_shadowCoord.xyz / v_shadowCoord.w;
  bool inRange = all(greaterThanEqual(projCoord, vec3(0.0))) &&
                 all(lessThanEqual(projCoord, vec3(1.0)));

  float shadowDepth = texture(u_projectedTexture, projCoord.xy).r;
  float currentDepth = projCoord.z + u_bias;
  float shadow = (inRange && shadowDepth < currentDepth) ? 0.0 : 1.0;

  vec3 baseColor = vec3(1.0);  // white
  float finalLight = u_lightEnabled ? light * shadow : 1.0;
  outColor = vec4(baseColor * finalLight, 1.0);
}
`;
