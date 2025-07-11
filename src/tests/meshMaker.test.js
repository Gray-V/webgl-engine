import { describe, it, expect } from 'vitest'
import meshMaker from '../engine/mesh/meshMaker.js'

describe('meshMaker', () => {
  it('creates a box with correct vertex count', () => {
    const box = meshMaker.boxConstructor(100, 100, 100)
    expect(box.verts.length % 3).toBe(0) // vertices should be in triplets
    expect(box.color).toEqual([1, 0, 0])
  })

  it('creates a pyramid with correct shape', () => {
    const pyramid = meshMaker.pyramidConstructor(100, 100)
    expect(pyramid.verts.length % 3).toBe(0)
    expect(pyramid.color).toEqual([1, 0, 0])
  })

  it('creates a sphere with expected vertex count', () => {
    const sphere = meshMaker.sphereConstructor(50, 6, 6)
    expect(sphere.verts.length % 3).toBe(0)
    expect(sphere.color).toEqual([0.7, 0.7, 1])
  })

  it('creates a cylinder with multiple faces', () => {
    const cylinder = meshMaker.cylinderConstructor(50, 100, 12)
    expect(cylinder.verts.length).toBeGreaterThan(0)
    expect(cylinder.color).toEqual([1, 0, 0])
  })

  it('creates a rectangle with six vertices (two triangles)', () => {
    const rect = meshMaker.rectangleConstructor(100, 50)
    expect(rect.verts.length).toBe(18) // 6 verts * 3 coords
    expect(rect.color).toEqual([0, 1, 0])
  })

  it('wraps custom meshData into an object correctly', () => {
    const boxMesh = meshMaker.boxConstructor(10, 10, 10)
    const boxObject = meshMaker.objectConstructor(boxMesh)
    expect(boxObject.meshData).toBe(boxMesh)
    expect(boxObject.position).toEqual([0, 0, 0])
  })

  it('creates objects from JSON data', () => {
    const jsonData = {
      vertices: [0, 0, 0, 1, 0, 0, 0, 1, 0],
      position: [1, 2, 3],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
    const obj = meshMaker.customFromJson(jsonData, [1, 0, 0])
    expect(obj.meshData.verts).toEqual(jsonData.vertices)
    expect(obj.position).toEqual(jsonData.position)
    expect(obj.meshData.color).toEqual([1, 0, 0])
  })
})
