import { m4 } from './matrix.js';

class Camera {
  constructor(position = [0, 0, -500], target = [0, 0, 0], up = [0, 1, 0]) {
    this.position = position;
    this.rotation = m4.identityMatrix();
    this.target = target;
    this.up = up;
  }

  move(dx, dy, dz) {
    this.position[0] += dx;
    this.position[1] += dy;
    this.position[2] += dz;
    this.target[0] += dx;
    this.target[1] += dy;
    this.target[2] += dz;
  }

  lookAt(targetX, targetY, targetZ) {
    this.target = [targetX, targetY, targetZ];
  }

  setPosition(x, y, z) {
    this.position = [x, y, z];
  }

  getViewMatrix() {
    return m4.lookAt(this.position, this.target, this.up);
  }
  
  rotate(rotationMatrix) {
    this.rotation = rotationMatrix
  }
}

export default Camera;
