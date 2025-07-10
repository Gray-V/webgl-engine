// Minimal glTF loader for static, textured models
function resolveRelativeUri(resourceUri, baseUri) {
  // If resourceUri is already absolute (starts with http or /), return as is
  if (/^(https?:)?\//.test(resourceUri)) return resourceUri;
  // Otherwise, resolve relative to baseUri
  const base = baseUri.substring(0, baseUri.lastIndexOf('/') + 1);
  return base + resourceUri;
}

export async function loadGLTF(url, gl) {
  // 1. Fetch and parse the .gltf JSON
  const gltf = await fetch(url).then(res => res.json());

  // 2. Fetch the .bin buffer
  const binUri = gltf.buffers[0].uri;
  const binUrl = resolveRelativeUri(binUri, url);
  const binBuffer = await fetch(binUrl).then(res => res.arrayBuffer());

  // 3. Load all images and create WebGL textures
  const images = gltf.images || [];
  const imagePromises = images.map(img => {
    const imageUrl = resolveRelativeUri(img.uri, url);
    return loadImage(imageUrl);
  });
  const loadedImages = await Promise.all(imagePromises);
  const textures = loadedImages.map(image => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    return tex;
  });

  // 4. Parse materials and map to textures
  // materialIndex -> textureIndex (or null)
  const materialToTexture = (gltf.materials || []).map(mat => {
    if (
      mat.pbrMetallicRoughness &&
      mat.pbrMetallicRoughness.baseColorTexture &&
      typeof mat.pbrMetallicRoughness.baseColorTexture.index === 'number'
    ) {
      const texIndex = gltf.textures[mat.pbrMetallicRoughness.baseColorTexture.index].source;
      return typeof texIndex === 'number' ? textures[texIndex] : null;
    }
    return null;
  });

  // 5. Parse mesh data for all meshes/primitives
  function getAccessorData(accessorIndex) {
    const accessor = gltf.accessors[accessorIndex];
    const bufferView = gltf.bufferViews[accessor.bufferView];
    const arrayType = {
      5126: Float32Array, // FLOAT
      5123: Uint16Array,  // UNSIGNED_SHORT
      5125: Uint32Array,  // UNSIGNED_INT
    }[accessor.componentType];
    const bytesPerElem = arrayType.BYTES_PER_ELEMENT;
    const numElems = accessor.count * {
      SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16
    }[accessor.type];
    const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
    return new arrayType(binBuffer, byteOffset, numElems);
  }

  // 6. Gather all primitives from all meshes
  const primitives = [];
  for (const mesh of gltf.meshes) {
    for (const primitive of mesh.primitives) {
      const positions = getAccessorData(primitive.attributes.POSITION);
      const normals = primitive.attributes.NORMAL !== undefined ? getAccessorData(primitive.attributes.NORMAL) : null;
      const uvs = primitive.attributes.TEXCOORD_0 !== undefined ? getAccessorData(primitive.attributes.TEXCOORD_0) : null;
      const indices = primitive.indices !== undefined ? getAccessorData(primitive.indices) : null;
      // Find the correct texture for this primitive
      let texture = null;
      if (typeof primitive.material === 'number' && materialToTexture[primitive.material]) {
        texture = materialToTexture[primitive.material];
      }
      primitives.push({ positions, normals, uvs, indices, texture });
    }
  }

  // Return array of primitives (each with its own texture)
  return { primitives };
}

function loadImage(uri) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = uri;
  });
} 