export default class Material {
  constructor(gl, vertexSource, fragmentSource) {
    this.shader = new Shader(gl, vertexSource, fragmentSource);
  }

  use(gl, transform, camera, shadowInfo = {}) {
    this.shader.use();

    // === Standard camera and transform uniforms ===
    if (camera?.getViewMatrix && camera?.getProjectionMatrix) {
      this.shader.setUniform('u_view', camera.getViewMatrix());
      this.shader.setUniform('u_projection', camera.getProjectionMatrix());
    }

    if (transform?.getMatrix) {
      this.shader.setUniform('u_world', transform.getMatrix());
    }

    // === Optional shadow-related uniforms ===
    if (shadowInfo.textureMatrix) {
      this.shader.setUniform('u_textureMatrix', shadowInfo.textureMatrix);
    }

    if (shadowInfo.depthTexture) {
      this.shader.setUniform('u_projectedTexture', shadowInfo.depthTexture, 1); // Use texture unit 1
    }

    if (shadowInfo.bias !== undefined) {
      this.shader.setUniform('u_bias', shadowInfo.bias);
    }

    if (shadowInfo.reverseLightDirection) {
      this.shader.setUniform('u_reverseLightDirection', shadowInfo.reverseLightDirection);
    }

    if (shadowInfo.lightEnabled !== undefined) {
      this.shader.setUniform('u_lightEnabled', shadowInfo.lightEnabled);
    }
  }
}
