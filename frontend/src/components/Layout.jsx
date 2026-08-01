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

  // Fonction utilitaire pour générer les éléments de liens réutilisables
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
      {/* Topbar classique simplifiée sur l'écran principal */}
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

      {/* Arrière-plan assombri */}
      {ouvert && <div className="sidebar-overlay" onClick={fermer} />}

      {/* Menu Coulissant Arrondi (Style Mobile BTP) */}
      <aside className={`sidebar ${ouvert ? 'ouvert' : ''}`}>
        
        {/* Le Logo est désormais fixe TOUT EN HAUT du menu coulissant */}
        <div className="sidebar-logo-conteneur">
          <img src="/logo.png" alt="BNA Bardage" className="sidebar-logo-img" />
        </div>

        {/* Corps du menu avec défilement interne */}
        <nav className="sidebar-nav">
          <div className="nav-liens-scroll">
            
            {/* Section 1 : Navigation principale */}
            {LIENS_PRINCIPAUX.map(renderLien)}

            {/* Section 2 : Organisation */}
            <div className="sidebar-separateur">Organisation</div>
            {LIENS_ORGANISATION.map(renderLien)}

            {/* Section 3 : Suivi */}
            <div className="sidebar-separateur">Suivi</div>
            {LIENS_SUIVI.map(renderLien)}
          </div>

          {/* Pied du menu fixe : Paramètres et Aide */}
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

      {/* Zone de contenu central de l'application */}
      <div className="main-column">
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}
