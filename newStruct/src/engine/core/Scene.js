import * as m4 from '../math/m4.js'

export default class Scene {
  constructor(gl) {
    this.gl = gl;
    this.gameObjects = [];
    this.mainCamera = null;
    this.shadowCamera = null;
  }

addGameObject(obj) {
  this.gameObjects.push(obj);
  obj.start(this.gl);
}


  setMainCamera(cam) {
    this.mainCamera = cam;
  }

  setShadowCamera(cam) {
    this.shadowCamera = cam;
  }

  render(lightEnabled = true) {
    const gl = this.gl;

    // === Shadow Pass ===
    if (this.shadowCamera) {
      this.shadowCamera.renderDepthPass(this);
    }

    // === Main Pass ===
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const camera = this.mainCamera;
    const proj = camera.getProjectionMatrix();
    const view = camera.getViewMatrix();

    const texMatrix = this.shadowCamera?.getTextureMatrix() ?? m4.identityMatrix();
    const depthTex = this.shadowCamera?.depthTexture ?? null;
    const lightDir = this.shadowCamera
      ? this.shadowCamera.getDirection()
      : [0, -1, 0];

    for (const obj of this.gameObjects) {
      if (!obj.active) continue;

      const renderer = obj.getComponent('MeshRenderer');
      if (!renderer) continue;

      const material = renderer.material;
      const model = obj.transform.getMatrix();

      // Call material.use with camera passed in
      material.use(gl, obj.transform, camera);

      // If the shader supports shadow uniforms, set them
      if (material.shader.setUniform) {
        material.shader.setUniform('u_textureMatrix', texMatrix);
        material.shader.setUniform('u_projectedTexture', depthTex, 1);
        material.shader.setUniform('u_bias', -0.006);
        material.shader.setUniform('u_lightEnabled', lightEnabled);
        material.shader.setUniform('u_reverseLightDirection', lightDir);
      }

      renderer.render(gl);
    }
  }

  renderDepth(glCam) {
    const gl = this.gl;

    const proj = glCam.getProjectionMatrix();
    const view = glCam.getViewMatrix();

    for (const obj of this.gameObjects) {
      const renderer = obj.getComponent('MeshRenderer');
      if (!renderer) continue;

      const model = obj.transform.getMatrix();
      const material = renderer.material;
      material.shader.use();
      material.shader.setUniform('u_world', model);
      material.shader.setUniform('u_view', view);
      material.shader.setUniform('u_projection', proj);
      renderer.render(gl, true); // depth-only flag
    }
  }

  // Optional helper to add and start a GameObject
  add(obj) {
    this.addGameObject(obj);
  }
}
