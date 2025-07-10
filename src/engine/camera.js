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

  setTarget(x, y, z) {
    this.target = [x, y, z];
  }

  getViewMatrix() {
    return m4.lookAt(this.position, this.target, this.up);
  }

  rotate(rotationMatrix) {
    this.rotation = rotationMatrix;
  }

  getForwardVector() {
    const forward = [
      this.target[0] - this.position[0],
      this.target[1] - this.position[1],
      this.target[2] - this.position[2],
    ];
    const length = Math.hypot(...forward);
    return forward.map(v => v / (length || 1));
  }

  /**
   * Make this camera follow a position with optional offset/smooth.
   * @param {Array} targetPos
   * @param {Object} options { offset: [x,y,z], smooth: 0-1, lookAt: boolean }
   */
  follow(targetPos, options = {}) {
    const offset = options.offset || [0, 0, 0];
    const smooth = options.smooth || 0;
    const lookAt = options.lookAt !== false;

    const desired = [
      targetPos[0] + offset[0],
      targetPos[1] + offset[1],
      targetPos[2] + offset[2],
    ];
    if (smooth > 0) {
      for (let i = 0; i < 3; i++) {
        this.position[i] += (desired[i] - this.position[i]) * smooth;
      }
    } else {
      this.position = desired;
    }

    if (lookAt) {
      this.target = [...targetPos];
    }
  }

  /**
   * Follow another camera's position and lookAt target.
   * @param {Camera} otherCamera
   * @param {Object} options { offset: [x,y,z], smooth: 0-1, lookAt: boolean }
   */
  followCamera(otherCamera, options = {}) {
    this.follow(otherCamera.position, options);
    if (options.lookAt !== false) {
      this.target = [...otherCamera.target];
    }
  }
}

export default Camera;
