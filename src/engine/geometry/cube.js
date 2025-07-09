export function createCubeVertices(width, height, length) {
  const x = width / 2
  const y = height / 2
  const z = length / 2
  
  return [
    // Face 1 (left)
    -x, y, -z,
    -x, y, z,
    -x, -y, z,
    -x, y, -z,
    -x, -y, -z,
    -x, -y, z,
    
    // Face 2 (right)
    x, y, -z,
    x, y, z,
    x, -y, z,
    x, y, -z,
    x, -y, -z,
    x, -y, z,
    
    // Face 3 (bottom)
    -x, -y, z,
    -x, -y, -z,
    x, -y, z,
    x, -y, z,
    x, -y, -z,
    -x, -y, -z,
    
    // Face 4 (top)
    -x, y, z,
    -x, y, -z,
    x, y, z,
    x, y, z,
    x, y, -z,
    -x, y, -z,
    
    // Face 5 (back)
    -x, y, -z,
    x, y, -z,
    x, -y, -z,
    -x, y, -z,
    -x, -y, -z,
    x, -y, -z,
    
    // Face 6 (front)
    -x, y, z,
    x, y, z,
    x, -y, z,
    -x, y, z,
    -x, -y, z,
    x, -y, z
  ]
}
