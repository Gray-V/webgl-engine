# WebGL Shaders

This directory contains all the shaders used by the WebGL engine, consolidated into a single location for better organization and maintenance.

## Shader Categories

### Main Lighting Shaders
- **`VERTEX_SHADER`** - Main vertex shader for 3D objects with lighting
- **`FRAGMENT_SHADER`** - Main fragment shader with PBR lighting, multiple light sources, and material properties

### GLTF Shaders
- **`GLTF_VERTEX_SHADER`** - Simple vertex shader for GLTF model loading
- **`GLTF_FRAGMENT_SHADER`** - Fragment shader with texture support for GLTF models

### Deferred Rendering Shaders
- **`DEFERRED_GBUFFER_VERTEX_SHADER_WEBGL2`** - G-buffer vertex shader for WebGL 2
- **`DEFERRED_GBUFFER_FRAGMENT_SHADER_WEBGL2`** - G-buffer fragment shader with multiple render targets
- **`DEFERRED_GBUFFER_VERTEX_SHADER_WEBGL1`** - G-buffer vertex shader for WebGL 1 fallback
- **`DEFERRED_GBUFFER_FRAGMENT_SHADER_WEBGL1`** - Simplified G-buffer fragment shader for WebGL 1
- **`DEFERRED_LIGHTING_VERTEX_SHADER`** - Full-screen quad vertex shader for lighting pass
- **`DEFERRED_LIGHTING_FRAGMENT_SHADER_WEBGL2`** - Lighting fragment shader using G-buffer textures
- **`DEFERRED_LIGHTING_FRAGMENT_SHADER_WEBGL1`** - Simplified lighting fragment shader for WebGL 1

## Usage

All shaders are exported from `index.js` and can be imported as needed:

```javascript
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../shaders/index.js';
```

## Features

### Main Lighting Shaders
- **PBR Materials**: Support for metallic, roughness, and shininess properties
- **Multiple Light Sources**: Up to 4 point lights plus directional light
- **Advanced Lighting**: Fresnel effects, rim lighting, gamma correction
- **Debug Features**: Normal visualization, ambient-only mode
- **Performance Optimized**: Efficient lighting calculations

### GLTF Shaders
- **Texture Support**: Automatic texture binding and sampling
- **Simple Pipeline**: Minimal overhead for model loading
- **UV Coordinates**: Proper texture coordinate handling

### Deferred Rendering Shaders
- **G-Buffer Pass**: Renders geometry data to multiple textures
- **Lighting Pass**: Applies all lighting in a single full-screen quad
- **WebGL Compatibility**: Supports both WebGL 1 and WebGL 2
- **Multiple Render Targets**: Full G-buffer support in WebGL 2

## Shader Uniforms

### Main Lighting Shaders
- `cameraTransform` - View matrix
- `sceneTransform` - Scene transformation
- `objectTransform` - Object transformation
- `projectionMatrix` - Projection matrix
- `normalMatrix` - Normal transformation matrix
- `objectColor` - Object base color
- `lightDirection` - Directional light direction
- `lightColor` - Directional light color
- `ambientColor` - Ambient lighting color
- `lightPositions[4]` - Point light positions
- `lightColors[4]` - Point light colors
- `numLights` - Number of active point lights
- `shininess` - Material shininess
- `metallic` - Material metallic value
- `roughness` - Material roughness value

### GLTF Shaders
- `uProjection` - Projection matrix
- `uView` - View matrix
- `uTexture` - Texture sampler
- `uHasTexture` - Texture availability flag

### Deferred Rendering Shaders
- G-buffer uniforms match main lighting shaders
- Lighting pass uses texture samplers for G-buffer data
- Additional camera position uniform for lighting calculations

## Performance Considerations

- **Forward Rendering**: Best for scenes with few objects and lights
- **Deferred Rendering**: Scales better with many objects and lights
- **WebGL 2**: Enables multiple render targets for full deferred rendering
- **WebGL 1**: Falls back to simplified deferred rendering
- **Shader Optimization**: Minimized branching and efficient math operations 