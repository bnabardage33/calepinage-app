import { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function MeteoWidget({ chantierId, lat, lon, compact = false }) {
  const [meteo, setMeteo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMeteo = async () => {
      try {
        setLoading(true)
        let url
        if (chantierId) {
          url = `/meteo/chantier/${chantierId}`
        } else if (lat && lon) {
          url = `/meteo/coords?lat=${lat}&lon=${lon}`
        } else {
          throw new Error('Coordonnées manquantes')
        }
        const response = await api.get(url)
        setMeteo(response.data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Erreur météo')
      } finally {
        setLoading(false)
      }
    }

    fetchMeteo()
    // Rafraîchir toutes les 30 minutes
    const interval = setInterval(fetchMeteo, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [chantierId, lat, lon])

  if (loading) {
    return (
      <div className="meteo-widget loading">
        <span className="meteo-spinner"></span>
        <span>Météo...</span>
      </div>
    )
  }

  if (error || !meteo) {
    return (
      <div className="meteo-widget error">
        <span>⚠️</span>
        <span>{error || 'Météo indisponible'}</span>
      </div>
    )
  }

  const { actuel, previsions, demain, peut_travailler } = meteo

  if (compact) {
    return (
      <div className={`meteo-widget compact ${peut_travailler.ok ? 'ok' : 'alerte'}`}>
        <div className="meteo-main">
          <img
            src={`https://openweathermap.org/img/wn/${actuel.icone}@2x.png`}
            alt={actuel.description}
            className="meteo-icone"
          />
          <span className="meteo-temp">{actuel.temperature}°C</span>
          <span className="meteo-vent">💨 {actuel.vent} km/h</span>
        </div>
        <div className="meteo-status">
          <span className={`meteo-badge ${peut_travailler.ok ? 'good' : 'bad'}`}>
            {peut_travailler.ok ? '✅ OK' : '⚠️'}
          </span>
          <span className="meteo-message">{peut_travailler.message}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="meteo-widget full">
      {/* Météo actuelle */}
      <div className="meteo-actuel">
        <div className="meteo-principale">
          <img
            src={`https://openweathermap.org/img/wn/${actuel.icone}@4x.png`}
            alt={actuel.description}
            className="meteo-icone-large"
          />
          <div className="meteo-temps">
            <span className="meteo-temp-large">{actuel.temperature}°C</span>
            <span className="meteo-ressenti">Ressenti {actuel.ressenti}°C</span>
            <span className="meteo-description">{actuel.description}</span>
          </div>
        </div>
        <div className="meteo-details">
          <span>💧 {actuel.humidite}%</span>
          <span>💨 {actuel.vent} km/h</span>
          {actuel.pluie > 0 && <span>🌧️ {actuel.pluie}mm</span>}
        </div>
      </div>

      {/* Prévisions */}
      {previsions.length > 0 && (
        <div className="meteo-previsions">
          {previsions.map((p, idx) => (
            <div key={idx} className="meteo-prev">
              <span className="meteo-prev-heure">{p.heure}</span>
              <img
                src={`https://openweathermap.org/img/wn/${p.icone}@2x.png`}
                alt={p.description}
                className="meteo-prev-icone"
              />
              <span className="meteo-prev-temp">{p.temperature}°C</span>
              <span className="meteo-prev-vent">💨 {p.vent} km/h</span>
            </div>
          ))}
        </div>
      )}

      {/* Demain */}
      <div className="meteo-demain">
        <span className="meteo-demain-label">📅 Demain</span>
        <img
          src={`https://openweathermap.org/img/wn/${demain.icone}@2x.png`}
          alt={demain.description}
          className="meteo-demain-icone"
        />
        <span className="meteo-demain-temp">{demain.temperature}°C</span>
        <span className="meteo-demain-desc">{demain.description}</span>
        {demain.pluie > 0 && <span className="meteo-demain-pluie">🌧️ {demain.pluie}mm</span>}
      </div>

      {/* Statut travail */}
      <div className={`meteo-travail ${peut_travailler.ok ? 'ok' : 'alerte'}`}>
        <span className="meteo-travail-icone">{peut_travailler.ok ? '✅' : '⚠️'}</span>
        <span className="meteo-travail-message">{peut_travailler.message}</span>
        <div className="meteo-travail-details">
          <span className={peut_travailler.pluie_ok ? 'good' : 'bad'}>🌧️ {peut_travailler.pluie_ok ? 'OK' : '⚠️'}</span>
          <span className={peut_travailler.vent_ok ? 'good' : 'bad'}>💨 {peut_travailler.vent_ok ? 'OK' : '⚠️'}</span>
          <span className={peut_travailler.temp_ok ? 'good' : 'bad'}>🌡️ {peut_travailler.temp_ok ? 'OK' : '⚠️'}</span>
        </div>
      </div>
    </div>
  )
}
