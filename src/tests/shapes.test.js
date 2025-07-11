import { describe, it, expect } from 'vitest'
import Shapes, { createCube, createSphere, createBox } from '../engine/geometry/shapes.js'

describe('Shapes Factory', () => {
  describe('Shapes.cube', () => {
    it('creates a cube with default parameters', () => {
      const cube = Shapes.cube()
      expect(cube.meshData).toBeDefined()
      expect(cube.position).toEqual([0, 0, 0])
      expect(cube.rotation).toEqual([0, 0, 0])
      expect(cube.scaleTransform).toEqual([1, 1, 1])
      expect(cube.meshData.color).toEqual([1, 0, 0])
    })

    it('creates a cube with custom parameters', () => {
      const cube = Shapes.cube(50, [1, 2, 3], [0.5, 0, 0], [2, 2, 2], [0, 1, 0])
      expect(cube.position).toEqual([1, 2, 3])
      expect(cube.rotation).toEqual([0.5, 0, 0])
      expect(cube.scaleTransform).toEqual([2, 2, 2])
      expect(cube.meshData.color).toEqual([0, 1, 0])
    })
  })

  describe('Shapes.box', () => {
    it('creates a box with custom dimensions', () => {
      const box = Shapes.box(20, 30, 40, [0, 0, 0], [0, 0, 0], [1, 1, 1], [0.5, 0.5, 0.5])
      expect(box.meshData).toBeDefined()
      expect(box.meshData.color).toEqual([0.5, 0.5, 0.5])
    })
  })

  describe('Shapes.sphere', () => {
    it('creates a sphere with default parameters', () => {
      const sphere = Shapes.sphere()
      expect(sphere.meshData).toBeDefined()
      expect(sphere.meshData.color).toEqual([0.7, 0.7, 1])
    })

    it('creates a sphere with custom parameters', () => {
      const sphere = Shapes.sphere(25, 8, 8, [0, 0, 0], [0, 0, 0], [1, 1, 1], [1, 0, 0])
      expect(sphere.meshData.color).toEqual([1, 0, 0])
    })
  })

  describe('Shapes.cylinder', () => {
    it('creates a cylinder with default parameters', () => {
      const cylinder = Shapes.cylinder()
      expect(cylinder.meshData).toBeDefined()
      expect(cylinder.meshData.color).toEqual([0.8, 0.8, 0.8])
    })
  })

  describe('Shapes.pyramid', () => {
    it('creates a pyramid with default parameters', () => {
      const pyramid = Shapes.pyramid()
      expect(pyramid.meshData).toBeDefined()
      expect(pyramid.meshData.color).toEqual([1, 0.5, 0])
    })
  })

  describe('Shapes.plane', () => {
    it('creates a plane with default parameters', () => {
      const plane = Shapes.plane()
      expect(plane.meshData).toBeDefined()
      expect(plane.meshData.color).toEqual([0.2, 0.8, 0.2])
    })
  })

  describe('Shapes.ground', () => {
    it('creates a ground plane with default parameters', () => {
      const ground = Shapes.ground()
      expect(ground.meshData).toBeDefined()
      expect(ground.position).toEqual([0, -100, 0])
      expect(ground.meshData.color).toEqual([0.3, 0.6, 0.3])
    })
  })

  describe('Shapes.wall', () => {
    it('creates a wall with default parameters', () => {
      const wall = Shapes.wall()
      expect(wall.meshData).toBeDefined()
      expect(wall.meshData.color).toEqual([0.8, 0.8, 0.8])
    })
  })

  describe('Convenience functions', () => {
    it('createCube function works', () => {
      const cube = createCube(25)
      expect(cube.meshData).toBeDefined()
      expect(cube.position).toEqual([0, 0, 0])
    })

    it('createSphere function works', () => {
      const sphere = createSphere(30)
      expect(sphere.meshData).toBeDefined()
      expect(sphere.meshData.color).toEqual([0.7, 0.7, 1])
    })

    it('createBox function works', () => {
      const box = createBox(10, 20, 30)
      expect(box.meshData).toBeDefined()
      expect(box.meshData.color).toEqual([1, 0, 0])
    })
  })
}) 