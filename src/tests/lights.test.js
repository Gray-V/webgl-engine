import { describe, it, expect } from 'vitest'
import { LightObject } from '../engine/lights/lightObject.js'
import { DirectionalLight } from '../engine/lights/directionalLight.js'
import { PointLight } from '../engine/lights/pointLight.js'
import { SpotLight } from '../engine/lights/spotLight.js'
import { AreaLight } from '../engine/lights/areaLight.js'
import { LightManager } from '../engine/lights/lightManager.js'

describe('Light System', () => {
  describe('LightObject', () => {
    it('creates a base light with default values', () => {
      const light = new LightObject('test')
      expect(light.type).toBe('test')
      expect(light.color).toEqual([1, 1, 1])
      expect(light.intensity).toBe(1.0)
      expect(light.enabled).toBe(true)
    })

    it('creates a light with custom options', () => {
      const light = new LightObject('test', {
        color: [1, 0, 0],
        intensity: 2.0,
        enabled: false,
        name: 'TestLight'
      })
      expect(light.color).toEqual([1, 0, 0])
      expect(light.intensity).toBe(2.0)
      expect(light.enabled).toBe(false)
      expect(light.name).toBe('TestLight')
    })

    it('can toggle enabled state', () => {
      const light = new LightObject('test')
      expect(light.enabled).toBe(true)
      light.toggle()
      expect(light.enabled).toBe(false)
      light.toggle()
      expect(light.enabled).toBe(true)
    })
  })

  describe('DirectionalLight', () => {
    it('creates a directional light with default direction', () => {
      const light = new DirectionalLight()
      expect(light.type).toBe('directional')
      expect(light.direction).toEqual([0, -1, 0])
    })

    it('can set direction', () => {
      const light = new DirectionalLight()
      light.setDirection([1, 0, 0])
      expect(light.direction).toEqual([1, 0, 0])
    })
  })

  describe('PointLight', () => {
    it('creates a point light with default position', () => {
      const light = new PointLight()
      expect(light.type).toBe('point')
      expect(light.position).toEqual([0, 0, 0])
      expect(light.range).toBe(100)
    })

    it('can set position and range', () => {
      const light = new PointLight()
      light.setPosition([10, 20, 30])
      light.setRange(200)
      expect(light.position).toEqual([10, 20, 30])
      expect(light.range).toBe(200)
    })
  })

  describe('SpotLight', () => {
    it('creates a spot light with default values', () => {
      const light = new SpotLight()
      expect(light.type).toBe('spot')
      expect(light.position).toEqual([0, 0, 0])
      expect(light.direction).toEqual([0, -1, 0])
      expect(light.angle).toBe(Math.PI / 6)
    })

    it('can set spot light properties', () => {
      const light = new SpotLight()
      light.setPosition([0, 100, 0])
      light.setDirection([0, -1, 0])
      light.setAngle(Math.PI / 4)
      light.setFalloff(0.2)
      expect(light.position).toEqual([0, 100, 0])
      expect(light.angle).toBe(Math.PI / 4)
      expect(light.falloff).toBe(0.2)
    })
  })

  describe('AreaLight', () => {
    it('creates an area light with default dimensions', () => {
      const light = new AreaLight()
      expect(light.type).toBe('area')
      expect(light.width).toBe(10)
      expect(light.height).toBe(10)
      expect(light.shape).toBe('rectangle')
    })

    it('can set area light properties', () => {
      const light = new AreaLight()
      light.setDimensions(50, 30)
      light.setShape('circle')
      expect(light.width).toBe(50)
      expect(light.height).toBe(30)
      expect(light.shape).toBe('circle')
    })
  })

  describe('LightManager', () => {
    it('creates an empty light manager', () => {
      const manager = new LightManager()
      expect(manager.directionalLights).toEqual([])
      expect(manager.pointLights).toEqual([])
      expect(manager.spotLights).toEqual([])
      expect(manager.areaLights).toEqual([])
    })

    it('can add different types of lights', () => {
      const manager = new LightManager()
      
      const dirLight = manager.addDirectionalLight({ direction: [0, -1, 0] })
      const pointLight = manager.addPointLight({ position: [0, 100, 0] })
      const spotLight = manager.addSpotLight({ position: [0, 200, 0] })
      const areaLight = manager.addAreaLight({ position: [0, 150, 0] })
      
      expect(manager.directionalLights).toHaveLength(1)
      expect(manager.pointLights).toHaveLength(1)
      expect(manager.spotLights).toHaveLength(1)
      expect(manager.areaLights).toHaveLength(1)
      
      expect(manager.directionalLights[0]).toBe(dirLight)
      expect(manager.pointLights[0]).toBe(pointLight)
      expect(manager.spotLights[0]).toBe(spotLight)
      expect(manager.areaLights[0]).toBe(areaLight)
    })

    it('can remove lights', () => {
      const manager = new LightManager()
      const light = manager.addDirectionalLight()
      
      expect(manager.directionalLights).toHaveLength(1)
      expect(manager.removeLight(light)).toBe(true)
      expect(manager.directionalLights).toHaveLength(0)
    })

    it('can get enabled lights only', () => {
      const manager = new LightManager()
      const light1 = manager.addDirectionalLight()
      const light2 = manager.addPointLight()
      
      light2.disable()
      
      const enabled = manager.getEnabledLights()
      expect(enabled.directional).toHaveLength(1)
      expect(enabled.point).toHaveLength(0)
    })

    it('can clear all lights', () => {
      const manager = new LightManager()
      manager.addDirectionalLight()
      manager.addPointLight()
      manager.addSpotLight()
      manager.addAreaLight()
      
      expect(manager.directionalLights).toHaveLength(1)
      expect(manager.pointLights).toHaveLength(1)
      expect(manager.spotLights).toHaveLength(1)
      expect(manager.areaLights).toHaveLength(1)
      
      manager.clear()
      
      expect(manager.directionalLights).toHaveLength(0)
      expect(manager.pointLights).toHaveLength(0)
      expect(manager.spotLights).toHaveLength(0)
      expect(manager.areaLights).toHaveLength(0)
    })
  })
}) 