import { NavLink, Route, Routes } from 'react-router'

import './App.css'

import ShapesDemoScene from './scenes/shapes/ShapesDemoScene.jsx'
import ForwardRendererDemo from './scenes/rendering/ForwardRendererDemo.jsx'
import DeferredRendererDemo from './scenes/rendering/DeferredRendererDemo.jsx'
import RendererComparisonDemo from './scenes/rendering/RendererComparisonDemo.jsx'
import CameraCompareDemo from './scenes/camera/CameraCompareDemo.jsx'
import GLTFModelScene from './scenes/gltf/GLTFModelScene.jsx'
import LightDemoScene from './scenes/lights/LightDemoScene.jsx'

const App = () => {
  return (
    <article className="App">
      <nav style={{ 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ddd',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 15px 0', color: '#333' }}>WebGL Engine - Demos</h1>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <NavLink 
            to="/" 
            style={({ isActive }) => ({
              padding: '8px 16px',
              textDecoration: 'none',
              backgroundColor: isActive ? '#4CAF50' : '#fff',
              color: isActive ? '#fff' : '#333',
              borderRadius: '4px',
              border: '1px solid #ddd'
            })}
          >
            Shapes Demo
          </NavLink>
          <NavLink 
            to="/forward" 
            style={({ isActive }) => ({
              padding: '8px 16px',
              textDecoration: 'none',
              backgroundColor: isActive ? '#4CAF50' : '#fff',
              color: isActive ? '#fff' : '#333',
              borderRadius: '4px',
              border: '1px solid #ddd'
            })}
          >
            Forward Renderer
          </NavLink>
          <NavLink 
            to="/deferred" 
            style={({ isActive }) => ({
              padding: '8px 16px',
              textDecoration: 'none',
              backgroundColor: isActive ? '#2196F3' : '#fff',
              color: isActive ? '#fff' : '#333',
              borderRadius: '4px',
              border: '1px solid #ddd'
            })}
          >
            Deferred Renderer
          </NavLink>
          <NavLink 
            to="/comparison" 
            style={({ isActive }) => ({
              padding: '8px 16px',
              textDecoration: 'none',
              backgroundColor: isActive ? '#FF9800' : '#fff',
              color: isActive ? '#fff' : '#333',
              borderRadius: '4px',
              border: '1px solid #ddd'
            })}
          >
            Comparison
          </NavLink>
          <NavLink 
            to="/camera-compare" 
            style={({ isActive }) => ({
              padding: '8px 16px',
              textDecoration: 'none',
              backgroundColor: isActive ? '#9C27B0' : '#fff',
              color: isActive ? '#fff' : '#333',
              borderRadius: '4px',
              border: '1px solid #ddd'
            })}
          >
            Camera Comparison Demo
          </NavLink>
          <NavLink 
            to="/gltf-model" 
            style={({ isActive }) => ({
              padding: '8px 16px',
              textDecoration: 'none',
              backgroundColor: isActive ? '#009688' : '#fff',
              color: isActive ? '#fff' : '#333',
              borderRadius: '4px',
              border: '1px solid #ddd'
            })}
          >
            glTF Model Demo
          </NavLink>
          <NavLink 
            to="/lights" 
            style={({ isActive }) => ({
              padding: '8px 16px',
              textDecoration: 'none',
              backgroundColor: isActive ? '#E91E63' : '#fff',
              color: isActive ? '#fff' : '#333',
              borderRadius: '4px',
              border: '1px solid #ddd'
            })}
          >
            Light System Demo
          </NavLink>
        </div>
      </nav>

      <main style={{ padding: '0 20px' }}>
        <Routes>
          <Route path="" element={<ShapesDemoScene />} />
          <Route path="forward" element={<ForwardRendererDemo />} />
          <Route path="deferred" element={<DeferredRendererDemo />} />
          <Route path="comparison" element={<RendererComparisonDemo />} />
          <Route path="shapes" element={<ShapesDemoScene />} />
          <Route path="camera-compare" element={<CameraCompareDemo />} />
          <Route path="gltf-model" element={<GLTFModelScene />} />
          <Route path="lights" element={<LightDemoScene />} />
        </Routes>
      </main>
    </article>
  )
}

export default App
