import Component from '../../core/Component.js';
import { m4 } from '../../math/m4.js';

export default class Camera extends Component {
  constructor(fov = 60, near = 0.1, far = 1000) {
    super();
    this.fov = fov;
    this.aspect = 1;
    this.near = near;
    this.far = far;
  }

  getProjectionMatrix() {
    return m4.perspectiveProjection(this.fov, this.aspect, this.near, this.far);
  }

  getViewMatrix() {
    const pos = this.gameObject.transform.position;
    const rot = this.gameObject.transform.rotation;

    // Look down -Z with no rotation for now
    const target = [pos[0], pos[1], pos[2] - 1];
    const up = [0, 1, 0];

    return m4.lookAt(pos, target, up);
  }

  getViewProjectionMatrix() {
    return m4.multiply(this.getProjectionMatrix(), this.getViewMatrix());
  }
}
