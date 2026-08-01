import MeteoWidget from '../components/MeteoWidget'

export default function Meteo() {
  // Coordonnées par défaut (Bordeaux) — à remplacer plus tard
  // par la sélection d'un chantier si tu veux la météo par chantier
  const lat = 44.8378
  const lon = -0.5792

  return (
    <div className="page-meteo">
      <h1>🌤️ Météo détaillée</h1>
      <p className="page-subtitle">
        Prévisions et conditions de travail pour le bardage
      </p>

      <MeteoWidget lat={lat} lon={lon} compact={false} />
    </div>
  )
}
