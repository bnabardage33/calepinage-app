import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Chantiers from './pages/Chantiers.jsx'
import ChantierDetail from './pages/ChantierDetail.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Chantiers</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Chantiers />} />
        <Route path="/chantiers/:id" element={<ChantierDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
