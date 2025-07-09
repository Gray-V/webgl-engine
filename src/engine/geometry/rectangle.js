export function createRectangleVertices(width, height) {
  const hWidth = width / 2
  const hHeight = height / 2
  
  return [
    -hWidth, -hHeight, 0,
    hWidth, -hHeight, 0,
    -hWidth, hHeight, 0,
    hWidth, -hHeight, 0,
    -hWidth, hHeight, 0,
    hWidth, hHeight, 0
  ]
} 