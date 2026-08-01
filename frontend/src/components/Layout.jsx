import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
// Ajustez le chemin d'importation ci-dessous selon l'emplacement réel de votre image
import logoImage from '../assets/logo.png' 

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

      {/* L'overlay couvre l'arrière-plan en gris semi-transparent quand le menu est ouvert */}
      {ouvert && <div className="sidebar-overlay" onClick={fermer} />}

      <aside className={`sidebar ${ouvert ? 'ouvert' : ''}`}>
        
        {/* Le conteneur du logo sur fond blanc pour faire ressortir l'image */}
        <div className="sidebar-logo-conteneur">
          <img src={logoImage} alt="BNA Bardage" className="sidebar-logo-img" />
        </div>

        {/* Le corps de la navigation */}
        <nav className="sidebar-nav">
          <div className="nav-liens-scroll">
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
          </div>

          {/* Section Paramètres isolée pour être propulsée tout en bas */}
          <div className="sidebar-footer">
            <span className="nav-desactive">
              <span className="nav-icone">⚙️</span>
              Paramètres
            </span>
          </div>
        </nav>
      </aside>

      <div className="main-column">
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}
