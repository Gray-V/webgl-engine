/**
 * This React app is purely starter boilerplate. Use it to demonstrate your 3D library.
 */
import { NavLink, Route, Routes } from 'react-router'

import './App.css'

import RandomObjScene from './scenes/RandomObjScene'
import NewMainScene from './scenes/NewMainScene'
import ShapesDemoScene from './scenes/ShapesDemoScene.jsx'
import ForwardRendererDemo from './scenes/ForwardRendererDemo.jsx'
import DeferredRendererDemo from './scenes/DeferredRendererDemo.jsx'
import RendererComparisonDemo from './scenes/RendererComparisonDemo.jsx'

const App = () => {
  return (
    <article className="App">
      <nav style={{ 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ddd',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 15px 0', color: '#333' }}>WebGL Engine - Renderer Demos</h1>
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
            to="/sandbox" 
            style={({ isActive }) => ({
              padding: '8px 16px',
              textDecoration: 'none',
              backgroundColor: isActive ? '#9C27B0' : '#fff',
              color: isActive ? '#fff' : '#333',
              borderRadius: '4px',
              border: '1px solid #ddd'
            })}
          >
            Sandbox
          </NavLink>
          <NavLink 
            to="/cube" 
            style={({ isActive }) => ({
              padding: '8px 16px',
              textDecoration: 'none',
              backgroundColor: isActive ? '#607D8B' : '#fff',
              color: isActive ? '#fff' : '#333',
              borderRadius: '4px',
              border: '1px solid #ddd'
            })}
          >
            Spinning Cube
          </NavLink>
        </div>
      </nav>

      <main style={{ padding: '0 20px' }}>
        <Routes>
          <Route path="" element={<ShapesDemoScene />} />
          <Route path="forward" element={<ForwardRendererDemo />} />
          <Route path="deferred" element={<DeferredRendererDemo />} />
          <Route path="comparison" element={<RendererComparisonDemo />} />
          <Route path="sandbox" element={<RandomObjScene />} />
          <Route path="cube" element={<NewMainScene />} />
          <Route path="shapes" element={<ShapesDemoScene />} />
        </Routes>
      </main>
    </article>
  )
}

export default App
