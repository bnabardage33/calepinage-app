import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chantiers from './pages/Chantiers.jsx'
import ChantierDetail from './pages/ChantierDetail.jsx'
import Clients from './pages/Clients.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chantiers" element={<Chantiers />} />
          <Route path="/chantiers/:id" element={<ChantierDetail />} />
          <Route path="/clients" element={<Clients />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
