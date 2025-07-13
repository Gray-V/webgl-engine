export function createCylinderVertices(radius = 1, height = 2, radialSegments = 32) {
  const verts = []

  const halfHeight = height / 2
  const angleStep = (2 * Math.PI) / radialSegments

  // Side faces - counter-clockwise winding for proper normals
  for (let i = 0; i < radialSegments; i++) {
    const theta = i * angleStep
    const nextTheta = (i + 1) * angleStep

    const x1 = radius * Math.cos(theta)
    const z1 = radius * Math.sin(theta)
    const x2 = radius * Math.cos(nextTheta)
    const z2 = radius * Math.sin(nextTheta)

    // First triangle (counter-clockwise)
    verts.push(x1, -halfHeight, z1)
    verts.push(x2, -halfHeight, z2)
    verts.push(x1, halfHeight, z1)

    // Second triangle (counter-clockwise)
    verts.push(x1, halfHeight, z1)
    verts.push(x2, -halfHeight, z2)
    verts.push(x2, halfHeight, z2)
  }

  // Top cap - counter-clockwise winding
  for (let i = 0; i < radialSegments; i++) {
    const theta = i * angleStep
    const nextTheta = (i + 1) * angleStep

    const x1 = radius * Math.cos(theta)
    const z1 = radius * Math.sin(theta)
    const x2 = radius * Math.cos(nextTheta)
    const z2 = radius * Math.sin(nextTheta)

    verts.push(0, halfHeight, 0)
    verts.push(x1, halfHeight, z1)
    verts.push(x2, halfHeight, z2)
  }

  // Bottom cap - counter-clockwise winding
  for (let i = 0; i < radialSegments; i++) {
    const theta = i * angleStep
    const nextTheta = (i + 1) * angleStep

    const x1 = radius * Math.cos(theta)
    const z1 = radius * Math.sin(theta)
    const x2 = radius * Math.cos(nextTheta)
    const z2 = radius * Math.sin(nextTheta)

    verts.push(0, -halfHeight, 0)
    verts.push(x2, -halfHeight, z2)
    verts.push(x1, -halfHeight, z1)
  }

  return verts
} 