import { LightObject } from './lightObject.js'

// Directional light - lights all objects from a direction (like the sun)
export class DirectionalLight extends LightObject {
  constructor(options = {}) {
    super('directional', options)
    this.direction = options.direction || [0, 1, 0] // Default pointing up (away from light source)
  }

  setDirection(direction) {
    this.direction = direction
  }

  getUniformData() {
    return {
      ...super.getUniformData(),
      direction: this.direction,
      type: 'directional'
    }
  }
}