// Base light class with common functionality
export class LightObject {
  constructor(type, options = {}) {
    this.type = type
    this.color = options.color || [1, 1, 1]
    this.intensity = options.intensity || 1.0
    this.enabled = options.enabled !== false
    this.name = options.name || `${type}Light`
  }

  setColor(color) {
    this.color = color
  }

  setIntensity(intensity) {
    this.intensity = intensity
  }

  toggle() {
    this.enabled = !this.enabled
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  getUniformData() {
    return {
      color: this.color,
      intensity: this.intensity,
      enabled: this.enabled
    }
  }
}