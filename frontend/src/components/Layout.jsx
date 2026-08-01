import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LIENS_PRINCIPAUX = [
  { to: '/', label: 'Tableau de bord', icone: '🏠' },
  { to: '/chantiers', label: 'Projets', icone: '🏗️' },
  { to: '/devis', label: 'Devis', icone: '📄' },
  { to: '/factures', label: 'Factures', icone: '🧾' },
  { to: '/clients', label: 'Clients', icone: '👥' },
]

const LIENS_ORGANISATION = [
  { to: '/planning', label: 'Planning', icone: '📅' },
  { to: '/calepinage', label: 'Calepinage Pro', icone: '📐' },
  { to: '/materiaux', label: 'Bibliothèque matériaux', icone: '📦' },
  { to: '/documents', label: 'Documents', icone: '📁' },
]

const LIENS_SUIVI = [
  { to: '/suivi', label: 'Suivi de chantier', icone: '🔨' },
  { to: '/depenses', label: 'Dépenses', icone: '💰' },
  { to: '/rapports', label: 'Rapports', icone: '📊' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const [ouvert, setOuvert] = useState(false)

  const fermer = () => setOuvert(false)

  const renderLien = (lien) => (
    <Link
      key={lien.to}
      to={lien.to}
      onClick={fermer}
      className={location.pathname === lien.to ? 'active' : ''}
    >
      <span className="nav-icone">{lien.icone}</span>
      {lien.label}
    </Link>
  )

  return (
    <div className="app-shell">
      {/* Barre supérieure fixe contenant le logo de bonne taille */}
      <header className="topbar">
        <button
          className="bouton-menu"
          onClick={() => setOuvert((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
        <div className="topbar-logo-conteneur">
          <img src="/logo.png" alt="BNA Bardage" className="topbar-logo-img" />
        </div>
      </header>

      {ouvert && <div className="sidebar-overlay" onClick={fermer} />}

      {/* Menu Coulissant épuré sans logo à l'intérieur */}
      <aside className={`sidebar ${ouvert ? 'ouvert' : ''}`}>
        <nav className="sidebar-nav">
          <div className="nav-liens-scroll">
            {LIENS_PRINCIPAUX.map(renderLien)}
            <div className="sidebar-separateur">Organisation</div>
            {LIENS_ORGANISATION.map(renderLien)}
            <div className="sidebar-separateur">Suivi</div>
            {LIENS_SUIVI.map(renderLien)}
          </div>

          <div className="sidebar-footer">
            <Link to="/parametres" onClick={fermer} className={location.pathname === '/parametres' ? 'active' : ''}>
              <span className="nav-icone">⚙️</span> Paramètres
            </Link>
            <Link to="/aide" onClick={fermer} className={location.pathname === '/aide' ? 'active' : ''}>
              <span className="nav-icone">❓</span> Aide & support
            </Link>
          </div>
        </nav>
      </aside>

      <div className="main-column">
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}

