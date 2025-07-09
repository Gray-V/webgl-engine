import { describe, it, expect } from 'vitest'
import { createCubeVertices } from './cube.js'
import { createSphereVertices } from './sphere.js'
import { createCylinderVertices } from './cylinder.js'
import { createPyramidVertices } from './pyramid.js'
import { createRectangleVertices } from './rectangle.js'

describe('Geometry Functions', () => {
  describe('createCubeVertices', () => {
    it('creates cube vertices with correct dimensions', () => {
      const verts = createCubeVertices(10, 10, 10)
      expect(verts.length % 3).toBe(0) // vertices should be in triplets
      expect(verts.length).toBe(36) // 6 faces * 6 vertices per face * 3 coords
    })

    it('creates cube with specified dimensions', () => {
      const verts = createCubeVertices(20, 10, 30)
      // Check that vertices span the correct range
      const xCoords = verts.filter((_, i) => i % 3 === 0)
      const yCoords = verts.filter((_, i) => i % 3 === 1)
      const zCoords = verts.filter((_, i) => i % 3 === 2)
      
      expect(Math.max(...xCoords)).toBeCloseTo(10) // width/2
      expect(Math.min(...xCoords)).toBeCloseTo(-10)
      expect(Math.max(...yCoords)).toBeCloseTo(5) // height/2
      expect(Math.min(...yCoords)).toBeCloseTo(-5)
      expect(Math.max(...zCoords)).toBeCloseTo(15) // length/2
      expect(Math.min(...zCoords)).toBeCloseTo(-15)
    })
  })

  describe('createSphereVertices', () => {
    it('creates sphere vertices with correct structure', () => {
      const verts = createSphereVertices(50, 8, 8)
      expect(verts.length % 3).toBe(0)
      expect(verts.length).toBeGreaterThan(0)
    })

    it('creates sphere with specified radius', () => {
      const radius = 25
      const verts = createSphereVertices(radius, 4, 4)
      // Check that vertices are within radius
      for (let i = 0; i < verts.length; i += 3) {
        const x = verts[i]
        const y = verts[i + 1]
        const z = verts[i + 2]
        const distance = Math.sqrt(x * x + y * y + z * z)
        expect(distance).toBeCloseTo(radius, 0)
      }
    })
  })

  describe('createCylinderVertices', () => {
    it('creates cylinder vertices with correct structure', () => {
      const verts = createCylinderVertices(10, 20, 8)
      expect(verts.length % 3).toBe(0)
      expect(verts.length).toBeGreaterThan(0)
    })

    it('creates cylinder with specified dimensions', () => {
      const radius = 5
      const height = 10
      const verts = createCylinderVertices(radius, height, 4)
      
      const yCoords = verts.filter((_, i) => i % 3 === 1)
      expect(Math.max(...yCoords)).toBeCloseTo(height / 2)
      expect(Math.min(...yCoords)).toBeCloseTo(-height / 2)
    })
  })

  describe('createPyramidVertices', () => {
    it('creates pyramid vertices with correct structure', () => {
      const verts = createPyramidVertices(10, 10)
      expect(verts.length % 3).toBe(0)
      expect(verts.length).toBe(45) // 5 faces * 9 vertices (3 triangles per face)
    })
  })

  describe('createRectangleVertices', () => {
    it('creates rectangle vertices with correct structure', () => {
      const verts = createRectangleVertices(10, 5)
      expect(verts.length).toBe(18) // 6 vertices * 3 coords
      expect(verts.length % 3).toBe(0)
    })

    it('creates rectangle with specified dimensions', () => {
      const width = 20
      const height = 10
      const verts = createRectangleVertices(width, height)
      
      const xCoords = verts.filter((_, i) => i % 3 === 0)
      const yCoords = verts.filter((_, i) => i % 3 === 1)
      
      expect(Math.max(...xCoords)).toBeCloseTo(width / 2)
      expect(Math.min(...xCoords)).toBeCloseTo(-width / 2)
      expect(Math.max(...yCoords)).toBeCloseTo(height / 2)
      expect(Math.min(...yCoords)).toBeCloseTo(-height / 2)
    })
  })
}) 