/**
 * This React app is purely starter boilerplate. Use it to demonstrate your 3D library.
 */
import { NavLink, Route, Routes } from 'react-router'

import './App.css'

import RandomObjScene from './scenes/RandomObjScene'
import NewMainScene from './scenes/NewMainScene'


const App = () => {
  return (
    <article className="App">
      <main>
        <Routes>
        <Route path="" element={<NewMainScene />} />
        <Route path="sandbox" element={<RandomObjScene />} />
        </Routes>
      </main>
    </article>
  )
}

export default App
