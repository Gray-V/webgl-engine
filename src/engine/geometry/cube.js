export function createCubeVertices(width, height, length) {
  const x = width / 2
  const y = height / 2
  const z = length / 2
  
  // Vertices from OBJ file (scaled by dimensions)
  const vertices = [
    // v 0.500000 -0.500000 -0.500000 -> [x, -y, -z]
    [x, -y, -z],   // 0: bottom-right-back
    // v 0.500000 -0.500000 0.500000 -> [x, -y, z]
    [x, -y, z],    // 1: bottom-right-front
    // v -0.500000 -0.500000 0.500000 -> [-x, -y, z]
    [-x, -y, z],   // 2: bottom-left-front
    // v -0.500000 -0.500000 -0.500000 -> [-x, -y, -z]
    [-x, -y, -z],  // 3: bottom-left-back
    // v 0.500000 0.500000 -0.500000 -> [x, y, -z]
    [x, y, -z],    // 4: top-right-back
    // v 0.500000 0.500000 0.500000 -> [x, y, z]
    [x, y, z],     // 5: top-right-front
    // v -0.500000 0.500000 0.500000 -> [-x, y, z]
    [-x, y, z],    // 6: top-left-front
    // v -0.500000 0.500000 -0.500000 -> [-x, y, -z]
    [-x, y, -z]    // 7: top-left-back
  ]
  
  // Face definitions from OBJ file (f 2/1/1 3/2/1 4/3/1 means vertices 2,3,4 with texture 1,2,3 and normal 1,1,1)
  // Note: OBJ indices are 1-based, so we subtract 1 to get 0-based indices
  // Fixed winding order to be consistently counter-clockwise when viewed from outside
  const faces = [
    // Bottom face (y = -y) - counter-clockwise when viewed from below
    [0, 1, 2],
    [0, 2, 3],
    
    // Top face (y = +y) - counter-clockwise when viewed from above
    [4, 6, 5],
    [4, 7, 6],
    
    // Right face (x = +x) - counter-clockwise when viewed from right
    [0, 4, 1],
    [1, 4, 5],
    
    // Front face (z = +z) - counter-clockwise when viewed from front
    [1, 5, 2],
    [2, 5, 6],
    
    // Left face (x = -x) - counter-clockwise when viewed from left
    [2, 6, 3],
    [3, 6, 7],
    
    // Back face (z = -z) - counter-clockwise when viewed from back
    [3, 7, 0],
    [0, 7, 4]
  ]
  
  // Flatten the vertices into a single array
  const result = []
  for (const face of faces) {
    for (const vertexIndex of face) {
      const vertex = vertices[vertexIndex]
      result.push(vertex[0], vertex[1], vertex[2])
    }
  }
  
  return result
}

export function createCubeNormals() {
  // Normals from OBJ file (vn entries)
  const faceNormals = [
    [0, -1, 0],    // vn 0.000000 -1.000000 0.000000 (bottom face)
    [0, 1, 0],     // vn 0.000000 1.000000 0.000000 (top face)
    [1, 0, 0],     // vn 1.000000 0.000000 0.000001 (right face)
    [0, 0, 1],     // vn -0.000000 -0.000000 1.000000 (front face)
    [-1, 0, 0],    // vn -1.000000 -0.000000 -0.000000 (left face)
    [0, 0, -1]     // vn 0.000000 0.000000 -1.000000 (back face)
  ]
  
  const result = []
  
  // Each face has 6 vertices (2 triangles), so repeat the normal 6 times
  for (const normal of faceNormals) {
    for (let i = 0; i < 6; i++) {
      result.push(normal[0], normal[1], normal[2])
    }
  }
  
  return result
}

// Create cube with per-vertex averaged normals for smooth shading
export function createCubeVerticesWithNormals(width = 1, height = 1, depth = 1) {
  const x = width / 2, y = height / 2, z = depth / 2;

  const vertices = [
    [ x, -y, -z], // 0
    [ x, -y,  z], // 1
    [-x, -y,  z], // 2
    [-x, -y, -z], // 3
    [ x,  y, -z], // 4
    [ x,  y,  z], // 5
    [-x,  y,  z], // 6
    [-x,  y, -z], // 7
  ];

  const faces = [
    // Each face: 2 triangles, 6 indices, normal per face
    { indices: [0, 1, 2, 0, 2, 3], normal: [ 0, -1,  0] }, // bottom
    { indices: [4, 6, 5, 4, 7, 6], normal: [ 0,  1,  0] }, // top
    { indices: [0, 4, 1, 1, 4, 5], normal: [ 1,  0,  0] }, // right
    { indices: [1, 5, 2, 2, 5, 6], normal: [ 0,  0,  1] }, // front
    { indices: [2, 6, 3, 3, 6, 7], normal: [-1,  0,  0] }, // left
    { indices: [3, 7, 0, 0, 7, 4], normal: [ 0,  0, -1] }, // back
  ];

  const positions = [];
  const normals = [];

  for (const face of faces) {
    for (const i of face.indices) {
      const v = vertices[i];
      const n = face.normal;
      positions.push(v[0], v[1], v[2]);
      normals.push(n[0], n[1], n[2]);
    }
  }

  return { positions, normals };
}

