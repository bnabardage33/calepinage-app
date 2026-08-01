// Dashboard.jsx — version augmentée
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MeteoWidget from '../components/MeteoWidget'
import { getChantiers, getClients } from '../api/client'

export default function Dashboard() {
  const [chantiers, setChantiers] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalChantiers: 0,
    enCours: 0,
    totalClients: 0,
    caTotal: 0,
    devisTotal: 0,
    facturesTotal: 0
  })

  useEffect(() => {
    Promise.all([getChantiers(), getClients()])
      .then(([c, cl]) => {
        setChantiers(c)
        setClients(cl)
        
        // Calcul stats réelles
        const enCours = c.filter(ch => ch.statut === 'en_cours')
        const caTotal = c.reduce((acc, ch) => acc + (ch.montant_estime || 0), 0)
        
        setStats({
          totalChantiers: c.length,
          enCours: enCours.length,
          totalClients: cl.length,
          caTotal: caTotal,
          devisTotal: 0, // à venir avec endpoint /devis
          facturesTotal: 0 // à venir avec endpoint /factures
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-spinner">Chargement...</div>

  return (
    <div className="dashboard-pro">
      {/* En-tête */}
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <span className="badge-date">{new Date().toLocaleDateString('fr-FR')}</span>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <span className="kpi-number">{stats.enCours}</span>
            <span className="kpi-label">Chantiers en cours</span>
          </div>
          <Link to="/chantiers" className="kpi-link">Voir →</Link>
        </div>
        <div className="kpi-card">
          <div>
            <span className="kpi-number">{stats.caTotal.toLocaleString()} €</span>
            <span className="kpi-label">Chiffre d'affaires</span>
          </div>
          <Link to="/rapports" className="kpi-link">Détail →</Link>
        </div>
        <div className="kpi-card">
          <div>
            <span className="kpi-number">{stats.devisTotal}</span>
            <span className="kpi-label">Devis</span>
          </div>
          <Link to="/devis" className="kpi-link">Voir →</Link>
        </div>
        <div className="kpi-card">
          <div>
            <span className="kpi-number">{stats.facturesTotal}</span>
            <span className="kpi-label">Factures</span>
          </div>
          <Link to="/factures" className="kpi-link">Voir →</Link>
        </div>
      </div>

      {/* 2 colonnes : chantiers + planning */}
      <div className="row-two">
        <div className="card">
          <div className="card-header">
            <h3>🚧 Chantiers en cours</h3>
            <Link to="/chantiers">Tous →</Link>
          </div>
          {chantiers.filter(c => c.statut === 'en_cours').length === 0 ? (
            <p className="empty-state">Aucun chantier en cours</p>
          ) : (
            chantiers.filter(c => c.statut === 'en_cours').map(c => (
              <div key={c.id} className="chantier-item">
                <span className="chantier-nom">{c.numero_unique}</span>
                <span className="chantier-lieu">{c.adresse_chantier}</span>
                <span className="chantier-progress">75%</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>📅 Planning de la semaine</h3>
            <Link to="/planning">Semaine →</Link>
          </div>
          <div className="planning-placeholder">
            <p>Les interventions de la semaine s'affichent ici</p>
            <small>Connecte-toi à l'API planning</small>
          </div>
        </div>
      </div>
      <div className="card">
  <div className="card-header">
    <h3>🌤️ Météo du jour</h3>
    <Link to="/meteo">Détail →</Link>
  </div>
  <MeteoWidget
    lat={44.8378}  // Exemple Bordeaux
    lon={-0.5792}
    compact={true}
  />
</div>

      {/* Accès rapide */}
      <div className="quick-access">
        <Link to="/chantiers/nouveau"><i className="icon">➕</i> Nouveau chantier</Link>
        <Link to="/clients/nouveau"><i className="icon">👤</i> Nouveau client</Link>
        <Link to="/calepinage"><i className="icon">📐</i> Calepinage Pro</Link>
        <Link to="/materiaux"><i className="icon">📦</i> Matériaux</Link>
      </div>
    </div>
  )
}
