export function createPyramidVertices(width, height) {
  const w = width / 2
  const z = w / 2
  const h = height / 2
  
  return [
    // Face 1 (front)
    -w, h, -z,
    -w, h, z,
    0, -h, 0,
    
    // Face 2 (back)
    w, h, -z,
    w, h, z,
    0, -h, 0,
    
    // Face 3 (left)
    -w, h, -z,
    -w, h, z,
    w, h, z,
    -w, h, -z,
    w, h, -z,
    w, h, z,
    
    // Face 4 (right)
    -w, h, -z,
    w, h, -z,
    0, -h, 0,
    
    // Face 5 (bottom)
    -w, h, z,
    w, h, z,
    0, -h, 0
  ]
} 