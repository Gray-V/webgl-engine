/**
 * This React app is purely starter boilerplate. Use it to demonstrate your 3D library.
 */
import { NavLink, Route, Routes } from 'react-router'

import './App.css'

import RandomObjScene from './scenes/RandomObjScene'
import NewMainScene from './scenes/NewMainScene'
import ShapesDemoScene from './scenes/ShapesDemoScene.jsx'

const App = () => {
  return (
    <article className="App">
      <main>
        <Routes>
          <Route path="" element={<ShapesDemoScene />} />
          <Route path="sandbox" element={<RandomObjScene />} />
          <Route path="cube" element={<NewMainScene />} />
          <Route path="shapes" element={<ShapesDemoScene />} />
        </Routes>
      </main>
    </article>
  )
}

export default App
