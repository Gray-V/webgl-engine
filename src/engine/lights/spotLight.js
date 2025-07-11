import { LightObject } from './lightObject.js'

// Spot light - cone of light from source (like a flashlight)
export class SpotLight extends LightObject {
  constructor(options = {}) {
    super('spot', options)
    this.position = options.position || [0, 0, 0]
    this.direction = options.direction || [0, 1, 0] // Pointing away from light source
    this.angle = options.angle || Math.PI / 6 // 30 degrees
    this.falloff = options.falloff || 0.1 // How quickly light falls off at edges
    this.range = options.range || 100
    this.attenuation = options.attenuation || {
      constant: 1.0,
      linear: 0.09,
      quadratic: 0.032
    }
  }

  setPosition(position) {
    this.position = position
  }

  setDirection(direction) {
    this.direction = direction
  }

  setAngle(angle) {
    this.angle = angle
  }

  setFalloff(falloff) {
    this.falloff = falloff
  }

  setRange(range) {
    this.range = range
  }

  getUniformData() {
    return {
      ...super.getUniformData(),
      position: this.position,
      direction: this.direction,
      angle: this.angle,
      falloff: this.falloff,
      range: this.range,
      attenuation: this.attenuation,
      type: 'spot'
    }
  }
}