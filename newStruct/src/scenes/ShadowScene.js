import Scene from '../engine/core/Scene.js'
import GameObject from '../engine/core/GameObject.js'
import Transform from '../engine/core/Transform.js'
import Camera from '../engine/components/core/Camera.js'
import ShadowCameraComponent from '../engine/components/core/ShadowCamera.js'
import MeshRenderer from '../engine/components/core/MeshRenderer.js'
import Material from '../engine/graphics/Material.js'
import Mesh from '../engine/graphics/Mesh.js'
import Cube from '../engine/primitives/Cube.js'
import AreaLight from '../engine/components/core/AreaLight.js'

import vertexShadow from '../shaders/projectedShadow.vert.js'
import fragmentShadow from '../shaders/projectedShadow.frag.js'

export default class ShadowScene extends Scene {
  constructor(gl) {
    super(gl); // pass the WebGL context to parent Scene

    // === Light ===
    const light = new GameObject("Light");
    light.transform.position = [5, 10, 5];
    light.addComponent(new AreaLight({
      color: [1, 1, 1],
      intensity: 1.0,
      castsShadows: true
    }));
    light.addComponent(new ShadowCameraComponent(gl));
    this.addGameObject(light);
    this.setShadowCamera(light.getComponent('ShadowCamera'));

    // === Main Camera ===
    const camera = new GameObject("MainCamera");
    camera.transform.position = [5, 5, 15];
    camera.addComponent(new Camera());
    this.addGameObject(camera);
    this.setMainCamera(camera.getComponent('Camera'));

    // === Cube ===
    const cube = new GameObject("Cube");
    cube.transform.position = [5, 0, 5];
    cube.addComponent(new MeshRenderer(
      new Mesh(new Cube()),
      new Material(gl, vertexShadow, fragmentShadow)
    ));
    this.addGameObject(cube);

    // === Floor ===
    const floor = new GameObject("Floor");
    floor.transform.scale = [20, 1, 20];
    floor.transform.position = [0, -1, 0];
    floor.addComponent(new MeshRenderer(
      new Mesh(new Cube()),
      new Material(gl, vertexShadow, fragmentShadow)
    ));
    this.addGameObject(floor);
  }
}
