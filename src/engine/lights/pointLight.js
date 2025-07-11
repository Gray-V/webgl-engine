import { LightObject } from './lightObject.js'

// Point light - emits light in all directions from a point (like a light bulb)
export class PointLight extends LightObject {
  constructor(options = {}) {
    super('point', options)
    this.position = options.position || [0, 0, 0]
    this.range = options.range || 100 // Maximum distance the light affects
    this.attenuation = options.attenuation || {
      constant: 1.0,
      linear: 0.09,
      quadratic: 0.032
    }
  }

  setPosition(position) {
    this.position = position
  }

  setRange(range) {
    this.range = range
  }

  setAttenuation(constant, linear, quadratic) {
    this.attenuation = { constant, linear, quadratic }
  }

  getUniformData() {
    return {
      ...super.getUniformData(),
      position: this.position,
      range: this.range,
      attenuation: this.attenuation,
      type: 'point'
    }
  }
}