import { LightObject } from './lightObject.js'

// Area light - rectangle area of light (like a light panel)
export class AreaLight extends LightObject {
  constructor(options = {}) {
    super('area', options)
    this.position = options.position || [0, 0, 0]
    this.direction = options.direction || [0, 1, 0] // Pointing away from light source
    this.width = options.width || 10
    this.height = options.height || 10
    this.shape = options.shape || 'rectangle' // 'rectangle' or 'circle'
    this.range = options.range || 100
  }

  setPosition(position) {
    this.position = position
  }

  setDirection(direction) {
    this.direction = direction
  }

  setDimensions(width, height) {
    this.width = width
    this.height = height
  }

  setShape(shape) {
    this.shape = shape
  }

  setRange(range) {
    this.range = range
  }

  getUniformData() {
    return {
      ...super.getUniformData(),
      position: this.position,
      direction: this.direction,
      width: this.width,
      height: this.height,
      shape: this.shape,
      range: this.range,
      type: 'area'
    }
  }
}