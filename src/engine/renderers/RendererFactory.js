import { ForwardRenderer } from './ForwardRenderer.js'
import { DeferredRenderer } from './DeferredRenderer.js'

/**
 * Renderer Factory - Creates appropriate renderers based on scene requirements
 */
export class RendererFactory {
  /**
   * Create a renderer based on scene characteristics
   * @param {WebGLRenderingContext} gl - WebGL context
   * @param {Scene} scene - The scene to render
   * @param {string} type - 'forward' or 'deferred'
   * @returns {BaseRenderer} The created renderer
   */
  static createRenderer(gl, scene, type = 'auto') {
    // Auto-detect based on scene characteristics
    if (type === 'auto') {
      type = this.autoDetectRendererType(scene)
    }

    let renderer
    switch (type.toLowerCase()) {
      case 'forward':
        renderer = new ForwardRenderer(gl, scene)
        break
      case 'deferred':
        renderer = new DeferredRenderer(gl, scene)
        break
      default:
        throw new Error(`Unknown renderer type: ${type}`)
    }

    // Initialize the renderer
    renderer.initialize()
    return renderer
  }

  /**
   * Auto-detect the best renderer type based on scene characteristics
   * @param {Scene} scene - The scene to analyze
   * @returns {string} 'forward' or 'deferred'
   */
  static autoDetectRendererType(scene) {
    const objectCount = scene.objects.length
    const lightCount = scene.lights.pointLights.length + 1 // +1 for directional light
    
    // Use deferred rendering for scenes with many objects or lights
    if (objectCount > 50 || lightCount > 8) {
      return 'deferred'
    }
    
    // Use forward rendering for simple scenes
    return 'forward'
  }

  /**
   * Get renderer information and recommendations
   * @param {Scene} scene - The scene to analyze
   * @returns {Object} Renderer recommendations
   */
  static getRendererInfo(scene) {
    const objectCount = scene.objects.length
    const lightCount = scene.lights.pointLights.length + 1
    
    const recommendations = {
      forward: {
        recommended: objectCount <= 50 && lightCount <= 8,
        pros: [
          'Simple to implement and debug',
          'Lower memory usage',
          'Good for scenes with few lights',
          'Supports transparency easily'
        ],
        cons: [
          'Performance degrades with many lights',
          'Limited post-processing capabilities',
          'Overdraw issues with complex scenes'
        ]
      },
      deferred: {
        recommended: objectCount > 50 || lightCount > 8,
        pros: [
          'Scales well with many lights',
          'Easy to add post-processing effects',
          'Better performance with complex lighting',
          'No overdraw issues'
        ],
        cons: [
          'Higher memory usage',
          'More complex to implement',
          'Limited transparency support',
          'Requires more GPU memory'
        ]
      }
    }

    return {
      sceneStats: {
        objects: objectCount,
        lights: lightCount
      },
      recommendations,
      autoDetected: this.autoDetectRendererType(scene)
    }
  }
}

export default RendererFactory 