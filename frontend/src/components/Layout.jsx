import { Link, useLocation } from 'react-router-dom'

const LIENS = [
  { to: '/', label: 'Tableau de bord' },
  { to: '/chantiers', label: 'Chantiers' },
  { to: '/clients', label: 'Clients' },
]

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-logo">Calepinage Bardage</div>
        <nav className="app-nav">
          {LIENS.map((lien) => (
            <Link
              key={lien.to}
              to={lien.to}
              className={location.pathname === lien.to ? 'active' : ''}
            >
              {lien.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="app-content">{children}</main>
    </div>
  )
}
