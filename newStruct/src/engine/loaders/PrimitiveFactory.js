import Mesh from '../graphics/Mesh.js';
import { createCube } from '../primitives/Cube.js';

const cache = new Map();

export function getPrimitiveMesh(type, size = 1) {
  const key = `${type}_${size}`;
  if (cache.has(key)) return cache.get(key);

  let data;
  switch (type) {
    case 'cube': data = createCube(size); break;
    default: throw new Error(`Unknown primitive type: ${type}`);
  }

  const mesh = new Mesh(data.vertices, data.indices);
  cache.set(key, mesh);
  return mesh;
}
