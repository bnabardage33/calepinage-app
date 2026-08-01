import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LIENS_ACTIFS = [
  { to: '/', label: 'Tableau de bord', icone: '🏠' },
  { to: '/chantiers', label: 'Projets', icone: '📋' },
  { to: '/clients', label: 'Clients', icone: '👥' },
]

const LIENS_A_VENIR = [
  { label: 'Devis', icone: '📄' },
  { label: 'Factures', icone: '🧾' },
  { label: 'Planning', icone: '📅' },
  { label: 'Calepinage Pro', icone: '📐' },
  { label: 'Bibliothèque matériaux', icone: '🧱' },
  { label: 'Documents', icone: '📁' },
  { label: 'Suivi de chantier', icone: '🔨' },
  { label: 'Dépenses', icone: '💶' },
  { label: 'Rapports', icone: '📊' },
  { label: 'Paramètres', icone: '⚙️' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const [ouvert, setOuvert] = useState(false)

  const fermer = () => setOuvert(false)

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="bouton-menu"
          onClick={() => setOuvert((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
        <span className="topbar-titre">BNA BARDAGE</span>
      </header>

      {ouvert && <div className="sidebar-overlay" onClick={fermer} />}

      <aside className={`sidebar ${ouvert ? 'ouvert' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-bna">BNA</span>
          <span className="sidebar-logo-bardage">BARDAGE</span>
          <span className="sidebar-logo-region">Nouvelle-Aquitaine</span>
        </div>

        <nav className="sidebar-nav">
          {LIENS_ACTIFS.map((lien) => (
            <Link
              key={lien.to}
              to={lien.to}
              onClick={fermer}
              className={location.pathname === lien.to ? 'active' : ''}
            >
              <span className="nav-icone">{lien.icone}</span>
              {lien.label}
            </Link>
          ))}

          <div className="sidebar-separateur">À venir</div>

          {LIENS_A_VENIR.map((lien) => (
            <span key={lien.label} className="nav-desactive">
              <span className="nav-icone">{lien.icone}</span>
              {lien.label}
            </span>
          ))}
        </nav>
      </aside>

      <div className="main-column">
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}
