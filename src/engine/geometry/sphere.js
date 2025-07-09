export function createSphereVertices(radius = 100, latBands = 12, longBands = 12) {
  const verts = []

  for (let lat = 0; lat < latBands; lat++) {
    const theta1 = (lat * Math.PI) / latBands
    const theta2 = ((lat + 1) * Math.PI) / latBands

    for (let lon = 0; lon < longBands; lon++) {
      const phi1 = (lon * 2 * Math.PI) / longBands
      const phi2 = ((lon + 1) * 2 * Math.PI) / longBands

      const x1 = radius * Math.sin(theta1) * Math.cos(phi1)
      const y1 = radius * Math.cos(theta1)
      const z1 = radius * Math.sin(theta1) * Math.sin(phi1)

      const x2 = radius * Math.sin(theta2) * Math.cos(phi1)
      const y2 = radius * Math.cos(theta2)
      const z2 = radius * Math.sin(theta2) * Math.sin(phi1)

      const x3 = radius * Math.sin(theta2) * Math.cos(phi2)
      const y3 = radius * Math.cos(theta2)
      const z3 = radius * Math.sin(theta2) * Math.sin(phi2)

      const x4 = radius * Math.sin(theta1) * Math.cos(phi2)
      const y4 = radius * Math.cos(theta1)
      const z4 = radius * Math.sin(theta1) * Math.sin(phi2)

      // Triangle 1
      verts.push(x1, y1, z1)
      verts.push(x2, y2, z2)
      verts.push(x3, y3, z3)

      // Triangle 2
      verts.push(x1, y1, z1)
      verts.push(x3, y3, z3)
      verts.push(x4, y4, z4)
    }
  }

  return verts
} 