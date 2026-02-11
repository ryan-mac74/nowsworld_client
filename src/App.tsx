import { Routes, Route } from 'react-router-dom'
import './App.css'
import NotFound from './routes/NotFound'
import Home from './routes/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
