import { describe, it, expect } from 'vitest'
import meshData from './meshData.js'

describe('meshData', () => {
  it('constructs with vertices, uvs, and color', () => {
    const verts = [0, 0, 0, 1, 1, 1]
    const uvs = [0, 0, 1, 1]
    const color = [1, 0, 0]

    const data = new meshData(verts, uvs, color)

    expect(data.verts).toBe(verts)
    expect(data.uvs).toBe(uvs)
    expect(data.color).toBe(color)
  })

  it('handles null uvs and default color gracefully', () => {
    const verts = [0, 0, 0, 1, 1, 1]
    const data = new meshData(verts, null, [0.5, 0.5, 0.5])

    expect(data.verts.length).toBe(6)
    expect(data.uvs).toBeNull()
    expect(data.color).toEqual([0.5, 0.5, 0.5])
  })
})
