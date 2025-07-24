import { m4 } from '../math/m4.js';

export default class Transform {
  constructor() {
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0]; // Euler angles in radians
    this.scale = [1, 1, 1];

    this.parent = null;
    this.children = [];
  }

  getLocalMatrix() {
    let m = m4.identityMatrix();
    m = m4.translate(m, ...this.position);
    m = m4.xRotate(m, this.rotation[0]);
    m = m4.yRotate(m, this.rotation[1]);
    m = m4.zRotate(m, this.rotation[2]);
    m = m4.scale(m, ...this.scale);
    return m;
  }

  getWorldMatrix() {
    const local = this.getLocalMatrix();
    if (this.parent) {
      const parentWorld = this.parent.getWorldMatrix();
      return m4.multiply(parentWorld, local);
    }
    return local;
  }

  setParent(parentTransform) {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index !== -1) this.parent.children.splice(index, 1);
    }
    this.parent = parentTransform;
    if (parentTransform) {
      parentTransform.children.push(this);
    }
  }
}
