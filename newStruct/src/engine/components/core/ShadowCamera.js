import { m4 } from '../../math/m4.js';

export default class ShadowCameraComponent {
  constructor() {
    this.depthFramebuffer = null;
    this.depthTexture = null;
    this.textureMatrix = m4.identityMatrix();
  }

  start(gl) {
    this.gl = gl;

    const size = 1024;

    // === Create depth texture ===
    this.depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.DEPTH_COMPONENT24,
      size,
      size,
      0,
      gl.DEPTH_COMPONENT,
      gl.UNSIGNED_INT,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // === Create framebuffer ===
    this.depthFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthFramebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      this.depthTexture,
      0
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  getProjectionMatrix() {
    return m4.orthographic(-10, 10, -10, 10, 0.1, 100);
  }

  getViewMatrix() {
    const position = this.gameObject.transform.position;
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    return m4.lookAt(position, target, up);
  }

  getTextureMatrix() {
    // Apply scale + bias and combine with projection and view
    let texMat = m4.identityMatrix();
    texMat = m4.translate(texMat, 0.5, 0.5, 0.5);
    texMat = m4.scale(texMat, 0.5, 0.5, 0.5);
    texMat = m4.multiply(texMat, this.getProjectionMatrix());
    texMat = m4.multiply(texMat, this.getViewMatrix());
    return texMat;
  }

  getDirection() {
    const pos = this.gameObject.transform.position;
    const dir = [-pos[0], -pos[1], -pos[2]];
    const len = Math.hypot(...dir);
    return len > 0 ? dir.map(x => x / len) : [0, -1, 0];
  }

  renderDepthPass(scene) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthFramebuffer);
    gl.viewport(0, 0, 1024, 1024);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    scene.renderDepth(this);
  }
}
