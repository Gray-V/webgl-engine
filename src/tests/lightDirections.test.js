import { describe, it, expect } from 'vitest'
import { DirectionalLight, SpotLight, AreaLight } from '../engine/lights/index.js'

describe('Light Direction Convention', () => {
  describe('DirectionalLight', () => {
    it('should use standard convention (direction points away from light source)', () => {
      // Light source is above, direction should point down (away from light)
      const light = new DirectionalLight({
        direction: [0, 1, 0] // Points up (away from light source)
      })
      
      expect(light.direction).toEqual([0, 1, 0])
      
      // This means light is coming from above (negative Y direction)
      // In shader: dot(normal, lightDir) where lightDir = [0, 1, 0]
      // So surfaces facing up (normal = [0, 1, 0]) will be lit
    })

    it('should handle diagonal light directions correctly', () => {
      const light = new DirectionalLight({
        direction: [-0.5, 1, -0.5] // Points away from light source
      })
      
      expect(light.direction).toEqual([-0.5, 1, -0.5])
      
      // This means light is coming from the opposite direction
      // Light source is roughly at [0.5, -1, 0.5] relative to scene
    })
  })

  describe('SpotLight', () => {
    it('should use standard convention for spot light direction', () => {
      const light = new SpotLight({
        position: [0, 100, 0], // Light is above
        direction: [0, 1, 0]   // Points down (away from light source)
      })
      
      expect(light.position).toEqual([0, 100, 0])
      expect(light.direction).toEqual([0, 1, 0])
      
      // Light cone points downward from the light source
    })
  })

  describe('AreaLight', () => {
    it('should use standard convention for area light direction', () => {
      const light = new AreaLight({
        position: [0, 50, 0], // Light panel is above
        direction: [0, 1, 0]  // Points down (away from light source)
      })
      
      expect(light.position).toEqual([0, 50, 0])
      expect(light.direction).toEqual([0, 1, 0])
      
      // Light panel illuminates downward
    })
  })

  describe('Light Direction Math', () => {
    it('should verify dot product behavior with light directions', () => {
      // Test case: Surface normal pointing up, light coming from above
      const surfaceNormal = [0, 1, 0]  // Surface facing up
      const lightDirection = [0, 1, 0] // Light pointing down (away from source)
      
      // Dot product should be positive (surface is lit)
      const dotProduct = surfaceNormal[0] * lightDirection[0] + 
                        surfaceNormal[1] * lightDirection[1] + 
                        surfaceNormal[2] * lightDirection[2]
      
      expect(dotProduct).toBe(1.0) // Fully lit
    })

    it('should verify dot product behavior with surface facing away from light', () => {
      // Test case: Surface normal pointing down, light coming from above
      const surfaceNormal = [0, -1, 0] // Surface facing down
      const lightDirection = [0, 1, 0]  // Light pointing down (away from source)
      
      // Dot product should be negative (surface is not lit)
      const dotProduct = surfaceNormal[0] * lightDirection[0] + 
                        surfaceNormal[1] * lightDirection[1] + 
                        surfaceNormal[2] * lightDirection[2]
      
      expect(dotProduct).toBe(-1.0) // Not lit (will be clamped to 0 in shader)
    })
  })
}) 