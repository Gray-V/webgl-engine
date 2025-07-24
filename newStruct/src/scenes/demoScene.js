import GameObject from '../engine/core/GameObject.js';
import MeshRenderer from '../engine/components/core/MeshRenderer.js';
import { getPrimitiveMesh } from '../engine/loaders/PrimitiveFactory.js';
import Material from '../engine/graphics/Material.js';
import Shader from '../engine/graphics/Shader.js';

export function createDemoScene(gl) {
  const scene = new Scene();

  const shader = new Shader(gl, 'default.vert', 'default.frag');
  const material = new Material(shader);

  const cube = new GameObject('Cube');
  const mesh = getPrimitiveMesh('cube');
  cube.addComponent(new MeshRenderer(mesh, material));

  cube.addComponent({
    update(dt) {
      cube.transform.rotation[1] += dt; // spin
    }
  });

  scene.add(cube);
  return scene;
}
