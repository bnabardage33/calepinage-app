import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getChantiers, getClients } from '../api/client'

export default function Dashboard() {
  const [chantiers, setChantiers] = useState([])
  const [clients, setClients] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    Promise.all([getChantiers(), getClients()])
      .then(([c, cl]) => {
        setChantiers(c)
        setClients(cl)
      })
      .finally(() => setChargement(false))
  }, [])

  if (chargement) return <p>Chargement...</p>

  const chantiersEnCours = chantiers.filter((c) => c.statut === 'en_cours')

  return (
    <div>
      <h1>Tableau de bord</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-nombre">{chantiers.length}</span>
          <span className="stat-label">Chantiers</span>
        </div>
        <div className="stat-card">
          <span className="stat-nombre">{chantiersEnCours.length}</span>
          <span className="stat-label">En cours</span>
        </div>
        <div className="stat-card">
          <span className="stat-nombre">{clients.length}</span>
          <span className="stat-label">Clients</span>
        </div>
      </div>

      <h2>Chantiers en cours</h2>
      {chantiersEnCours.length === 0 ? (
        <p>Aucun chantier en cours pour l'instant.</p>
      ) : (
        <ul>
          {chantiersEnCours.map((c) => (
            <li key={c.id}>
              <Link to={`/chantiers/${c.id}`}>
                {c.numero_unique} — {c.adresse_chantier}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="dashboard-actions">
        <Link to="/chantiers" className="bouton">
          Voir tous les chantiers
        </Link>
        <Link to="/clients" className="bouton">
          Voir tous les clients
        </Link>
      </div>
    </div>
  )
}
