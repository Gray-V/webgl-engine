import ShadowScene from './scenes/ShadowScene.js';

function main() {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error('WebGL2 not supported');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  const scene = new ShadowScene(gl); 

  function render() {
    scene.render(true); // pass true to enable lighting
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
