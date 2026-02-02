import { Routes, Route } from 'react-router-dom'
import './App.css'
import NotFound from './pages/NotFound'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
