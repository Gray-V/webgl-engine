import { DirectionalLight, PointLight, SpotLight, AreaLight } from './index.js'

export class LightManager {
  constructor() {
    this.directionalLights = []
    this.pointLights = []
    this.spotLights = []
    this.areaLights = []
    this.ambient = [0.1, 0.1, 0.1]
  }

  addDirectionalLight(options = {}) {
    const light = new DirectionalLight(options)
    this.directionalLights.push(light)
    return light
  }

  addPointLight(options = {}) {
    const light = new PointLight(options)
    this.pointLights.push(light)
    return light
  }

  addSpotLight(options = {}) {
    const light = new SpotLight(options)
    this.spotLights.push(light)
    return light
  }

  addAreaLight(options = {}) {
    const light = new AreaLight(options)
    this.areaLights.push(light)
    return light
  }

  removeLight(light) {
    const arrays = [this.directionalLights, this.pointLights, this.spotLights, this.areaLights]
    for (const array of arrays) {
      const index = array.indexOf(light)
      if (index !== -1) {
        array.splice(index, 1)
        return true
      }
    }
    return false
  }

  setAmbient(color) {
    this.ambient = color
  }

  getEnabledLights() {
    return {
      directional: this.directionalLights.filter(l => l.enabled),
      point: this.pointLights.filter(l => l.enabled),
      spot: this.spotLights.filter(l => l.enabled),
      area: this.areaLights.filter(l => l.enabled)
    }
  }

  getAllLights() {
    return {
      directional: this.directionalLights,
      point: this.pointLights,
      spot: this.spotLights,
      area: this.areaLights
    }
  }

  // Get uniform data for shaders (compatible with current scene structure)
  getUniformData() {
    const enabled = this.getEnabledLights()
    
    return {
      ambient: this.ambient,
      directional: enabled.directional.length > 0 ? enabled.directional[0].getUniformData() : null,
      pointLights: enabled.point.slice(0, 8), // Limit to 8 point lights for shader compatibility
      spotLights: enabled.spot.slice(0, 4), // Limit to 4 spot lights
      areaLights: enabled.area.slice(0, 2) // Limit to 2 area lights
    }
  }

  // Legacy compatibility with existing scene structure
  getLegacyLightData() {
    const enabled = this.getEnabledLights()
    
    return {
      directional: enabled.directional.length > 0 ? {
        direction: enabled.directional[0].direction,
        color: enabled.directional[0].color,
        intensity: enabled.directional[0].intensity
      } : {
        direction: [0, 1, 0], // Pointing away from light source (standard convention)
        color: [0.2, 0.2, 0.2],
        intensity: 0.2
      },
      pointLights: enabled.point.slice(0, 8).map(light => ({
        position: light.position,
        color: light.color,
        intensity: light.intensity
      }))
    }
  }

  clear() {
    this.directionalLights = []
    this.pointLights = []
    this.spotLights = []
    this.areaLights = []
  }
} 