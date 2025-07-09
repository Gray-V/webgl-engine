import { describe, it, expect, vi, beforeEach } from 'vitest'
import object from './object.js'
import m4 from './matrix.js'

// Dummy mesh with one triangle
const mockMesh = {
  verts: [0, 0, 0, 1, 0, 0, 0, 1, 0],
  color: [1, 0, 0],
  isWireFrame: false
}

let parent, child, grandchild

describe('Scene Graph Object', () => {
  beforeEach(() => {
    parent = new object(mockMesh, [1, 2, 3], [0.1, 0.2, 0.3], [1, 1, 1])
    child = new object(mockMesh, [4, 5, 6], [0, 0, 0], [1, 1, 1])
    grandchild = new object(mockMesh, [0, 0, 1], [0, 0, 0], [1, 1, 1])
  })

  it('constructs without parent by default', () => {
    const o = new object(mockMesh)
    expect(o.parent).toBeNull()
    expect(o.children).toEqual([])
  })

  it('setParent registers child in parent', () => {
    child.setParent(parent)
    expect(child.parent).toBe(parent)
    expect(parent.children).toContain(child)
  })

  it('reparenting removes child from old parent', () => {
    const other = new object(mockMesh)
    child.setParent(parent)
    expect(parent.children).toContain(child)

    child.setParent(other)
    expect(child.parent).toBe(other)
    expect(parent.children).not.toContain(child)
    expect(other.children).toContain(child)
  })

  it('translate updates position', () => {
    const o = new object(mockMesh, [0, 0, 0], [0, 0, 0], [1, 1, 1])
    o.translate(1, 2, 3)
    expect(o.position).toEqual([1, 2, 3])
  })

  it('rotate updates rotation', () => {
    const o = new object(mockMesh, [0, 0, 0], [0, 0, 0], [1, 1, 1])
    o.rotate(Math.PI, 0.5, 0.25)
    expect(o.rotation).toEqual([Math.PI, 0.5, 0.25])
  })

  it('scale multiplies scaleTransform', () => {
    const o = new object(mockMesh, [0, 0, 0], [0, 0, 0], [1, 2, 3])
    o.scale(2, 0.5, 1)
    expect(o.scaleTransform).toEqual([2, 1, 3])
  })

  it('getLocalTransform returns correct matrix', () => {
    const o = new object(mockMesh, [1, 2, 3], [0, 0, 0], [2, 2, 2])
    const result = o.getLocalTransform()
    const expected = m4.scale(
      m4.translate(m4.identityMatrix(), 1, 2, 3),
      2, 2, 2
    )
    expect(result).toEqual(expected)
  })

  it('getWorldTransform combines parent transforms', () => {
    child.setParent(parent)
    const parentMatrix = parent.getLocalTransform()
    const childMatrix = child.getLocalTransform()
    const expected = m4.multiply(parentMatrix, childMatrix)
    expect(child.getWorldTransform()).toEqual(expected)
  })

  it('draw renders itself and children recursively', () => {
    // Mock WebGL context and shader
    const gl = {
      getAttribLocation: vi.fn(() => 0),
      getUniformLocation: vi.fn(() => ({})),
      createBuffer: vi.fn(() => ({})),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      vertexAttribPointer: vi.fn(),
      uniformMatrix4fv: vi.fn(),
      drawArrays: vi.fn()
    }

    const shader = {}

    parent.setParent(null)
    child.setParent(parent)
    grandchild.setParent(child)

    parent.draw(gl, shader, m4.identityMatrix())

    expect(gl.drawArrays).toHaveBeenCalledTimes(3) // parent, child, grandchild
  })

  it('draw handles no children safely', () => {
    const gl = {
      getAttribLocation: vi.fn(() => 0),
      getUniformLocation: vi.fn(() => ({})),
      createBuffer: vi.fn(() => ({})),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      vertexAttribPointer: vi.fn(),
      uniformMatrix4fv: vi.fn(),
      drawArrays: vi.fn()
    }

    const shader = {}
    parent.draw(gl, shader, m4.identityMatrix())
    expect(gl.drawArrays).toHaveBeenCalledTimes(1)
  })
})
