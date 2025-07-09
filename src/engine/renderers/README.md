# WebGL Renderer System

This directory contains the renderer implementations for the WebGL engine, providing both Forward and Deferred rendering approaches.

## Overview

The renderer system consists of:

- **BaseRenderer**: Abstract base class with common functionality
- **ForwardRenderer**: Traditional rendering approach
- **DeferredRenderer**: Modern rendering approach with G-buffer
- **RendererFactory**: Factory class for creating appropriate renderers

## Forward Rendering

### How it Works
1. Each object is rendered directly to the screen
2. Lighting is calculated per-fragment for each object
3. All lighting calculations happen in the fragment shader

### Pros
- Simple to implement and debug
- Lower memory usage
- Good for scenes with few lights
- Supports transparency easily
- Faster for simple scenes

### Cons
- Performance degrades with many lights
- Limited post-processing capabilities
- Overdraw issues with complex scenes
- Each light requires additional rendering passes

### Best For
- Scenes with ≤50 objects and ≤8 lights
- Simple lighting requirements
- When transparency is needed
- Mobile or low-end devices

## Deferred Rendering

### How it Works
1. **Geometry Pass**: Render all objects to G-buffer textures
   - Albedo (diffuse color)
   - Normal (surface normal)
   - Position (world position)
   - Material (shininess, metallic, roughness)
2. **Lighting Pass**: Apply all lights using G-buffer data
   - Single full-screen quad
   - All lighting calculated in one pass

### Pros
- Scales well with many lights
- Easy to add post-processing effects
- Better performance with complex lighting
- No overdraw issues
- Efficient for scenes with many objects

### Cons
- Higher memory usage (G-buffer textures)
- More complex to implement
- Limited transparency support
- Requires more GPU memory
- Can't handle transparent objects easily

### Best For
- Scenes with >50 objects or >8 lights
- Complex lighting requirements
- When post-processing is needed
- High-end devices

## Usage

### Basic Usage
```javascript
import { RendererFactory } from './engine/renderers/index.js'

// Auto-detect renderer type
const renderer = RendererFactory.createRenderer(gl, scene, 'auto')

// Or specify explicitly
const forwardRenderer = RendererFactory.createRenderer(gl, scene, 'forward')
const deferredRenderer = RendererFactory.createRenderer(gl, scene, 'deferred')
```

### Manual Creation
```javascript
import { ForwardRenderer, DeferredRenderer } from './engine/renderers/index.js'

// Create forward renderer
const forwardRenderer = new ForwardRenderer(gl, scene)
forwardRenderer.initialize()

// Create deferred renderer
const deferredRenderer = new DeferredRenderer(gl, scene)
deferredRenderer.initialize()
```

### Getting Renderer Information
```javascript
import { RendererFactory } from './engine/renderers/index.js'

const info = RendererFactory.getRendererInfo(scene)
console.log('Scene stats:', info.sceneStats)
console.log('Recommendations:', info.recommendations)
console.log('Auto-detected:', info.autoDetected)
```

## Performance Considerations

### Forward Rendering
- **CPU Bound**: More draw calls
- **Memory**: Lower usage
- **GPU**: Less texture memory, more fragment shader work
- **Scaling**: Linear with number of lights

### Deferred Rendering
- **CPU Bound**: Fewer draw calls
- **Memory**: Higher usage (G-buffer textures)
- **GPU**: More texture memory, efficient fragment shader work
- **Scaling**: Constant with number of lights

## G-Buffer Layout

The deferred renderer uses 4 G-buffer textures:

1. **Albedo** (RGBA8): Diffuse color of the surface
2. **Normal** (RGBA8): Surface normal in world space (packed)
3. **Position** (RGBA16F): World position of the surface
4. **Material** (RGBA8): Material properties (shininess, metallic, roughness)

## Shader Differences

### Forward Rendering Shaders
- Single vertex/fragment shader pair
- All lighting calculated in fragment shader
- Uniforms for each light source

### Deferred Rendering Shaders
- **G-Buffer Pass**: Vertex shader + fragment shader that outputs to multiple render targets
- **Lighting Pass**: Simple vertex shader + fragment shader that samples G-buffer textures

## Future Enhancements

- **Tiled Deferred Rendering**: For even better performance with many lights
- **Forward+ Rendering**: Hybrid approach combining benefits of both
- **Transparency Support**: For deferred rendering
- **Post-Processing Pipeline**: Built on top of deferred rendering
- **Shadow Mapping**: Integration with both renderers 