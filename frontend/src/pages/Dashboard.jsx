import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../api/client'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalChantiers: 0,
    enCours: 0,
    totalClients: 0,
    caTotal: 0,
    chantiersEnCours: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(err => console.error('Erreur chargement dashboard:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-pro">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p className="dashboard-subtitle">
            Vue d'ensemble de votre activité
          </p>
        </div>
        <span className="badge-date">
          📅 {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </span>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <span className="kpi-number">{stats.enCours}</span>
            <span className="kpi-label">Chantiers en cours</span>
          </div>
          <Link to="/chantiers" className="kpi-link">
            Voir <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="kpi-card">
          <div>
            <span className="kpi-number">
              {stats.caTotal.toLocaleString('fr-FR')} €
            </span>
            <span className="kpi-label">Chiffre d'affaires</span>
          </div>
          <Link to="/rapports" className="kpi-link">
            Détail <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="kpi-card">
          <div>
            <span className="kpi-number">8</span>
            <span className="kpi-label">Devis</span>
          </div>
          <Link to="/devis" className="kpi-link">
            Voir <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="kpi-card">
          <div>
            <span className="kpi-number">4</span>
            <span className="kpi-label">Factures</span>
          </div>
          <Link to="/factures" className="kpi-link">
            Voir <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>

      {/* 2 COLONNES */}
      <div className="row-two">
        {/* Chantiers en cours */}
        <div className="card">
          <div className="card-header">
            <h3>🚧 Chantiers en cours</h3>
            <Link to="/chantiers">Tous →</Link>
          </div>

          {stats.chantiersEnCours.length === 0 ? (
            <div className="empty-state">
              <p>Aucun chantier en cours</p>
              <Link to="/chantiers" className="btn-primary">
                + Créer un chantier
              </Link>
            </div>
          ) : (
            stats.chantiersEnCours.map((chantier) => (
              <div key={chantier.id} className="chantier-item">
                <div className="chantier-info">
                  <span className="chantier-nom">{chantier.numero_unique}</span>
                  <span className="chantier-lieu">{chantier.adresse_chantier}</span>
                </div>
                <div className="chantier-right">
                  <span className="chantier-progress">
                    {Math.floor(Math.random() * 40 + 40)}%
                  </span>
                  <Link 
                    to={`/chantiers/${chantier.id}`}
                    className="chantier-link"
                  >
                    →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Planning */}
        <div className="card">
          <div className="card-header">
            <h3>📅 Planning de la semaine</h3>
            <Link to="/planning">Semaine →</Link>
          </div>

          <div className="planning-list">
            {[
              { jour: 'Lun.', date: '28/07', chantier: 'Entrepôt LOGIX', horaire: '07h30 - 17h00' },
              { jour: 'Mar.', date: '29/07', chantier: 'Bâtiment industriel ABC', horaire: '07h30 - 17h00' },
              { jour: 'Mer.', date: '30/07', chantier: 'Entrepôt LOGIX', horaire: '07h30 - 17h00' },
              { jour: 'Jeu.', date: '31/07', chantier: 'Maison individuelle M.', horaire: 'Pose bardage' },
              { jour: 'Ven.', date: '01/08', chantier: 'Hanger agricole', horaire: '07h30 - 17h00' },
            ].map((item, idx) => (
              <div key={idx} className="planning-item">
                <span className="planning-jour">{item.jour}</span>
                <div className="planning-info">
                  <span className="planning-titre">{item.chantier}</span>
                  <span className="planning-date">{item.date}</span>
                </div>
                <span className="planning-horaire">{item.horaire}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RAPPELS & TÂCHES */}
      <div className="card full-width">
        <div className="card-header">
          <h3>📋 Rappels & tâches</h3>
          <Link to="/taches">Voir tout →</Link>
        </div>
        <div className="taches-grid">
          <div className="tache-item urgent">
            <span>🔴 Relancer devis D-2026-033</span>
            <span className="tache-date">Aujourd'hui</span>
          </div>
          <div className="tache-item">
            <span>📄 Envoyer facture F-2026-038</span>
            <span className="tache-date">Demain</span>
          </div>
          <div className="tache-item">
            <span>📦 Commander bavettes RAL 7016</span>
            <span className="tache-date">31/07/2026</span>
          </div>
          <div className="tache-item">
            <span>👷 Vérifier planning équipe</span>
            <span className="tache-date">01/08/2026</span>
          </div>
          <div className="tache-item urgent">
            <span>⚠️ Facture impayée - ABC CONSTRUCTION</span>
            <span className="tache-date">03/08/2026</span>
          </div>
        </div>
      </div>

      {/* ACCÈS RAPIDE */}
      <div className="quick-access">
        <Link to="/chantiers/nouveau">📝 Nouveau devis</Link>
        <Link to="/factures/nouvelle">🧾 Nouvelle facture</Link>
        <Link to="/chantiers/nouveau">🏗️ Nouveau projet</Link>
        <Link to="/calepinage">📐 Calepinage Pro</Link>
        <Link to="/materiaux">📦 Bibliothèque matériaux</Link>
        <Link to="/documents">📁 Documents</Link>
      </div>
    </div>
  )
}
