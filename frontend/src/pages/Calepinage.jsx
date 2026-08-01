import { useState, useEffect } from 'react'
import { getChantiers, getFacades } from '../api/client'
import FacadeForm from '../components/FacadeForm'
import Plan2D from '../components/Plan2D'

export default function Calepinage() {
  const [chantiers, setChantiers] = useState([])
  const [chantierId, setChantierId] = useState('')
  const [facades, setFacades] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    getChantiers().then((data) => {
      setChantiers(data)
      if (data.length > 0) setChantierId(data[0].id)
      setChargement(false)
    })
  }, [])

  const chargerFacades = (id) => {
    if (!id) return
    getFacades(id).then(setFacades)
  }

  useEffect(() => {
    if (chantierId) chargerFacades(chantierId)
  }, [chantierId])

  if (chargement) return <p>Chargement...</p>

  return (
    <div className="page-calepinage">
      <h1>📐 Calepinage Pro</h1>
      <p className="page-subtitle">Plan 2D et calcul du métré par façade</p>

      {chantiers.length === 0 ? (
        <p className="empty-state">Aucun chantier disponible. Crée d'abord un chantier.</p>
      ) : (
        <>
          <label className="chantier-select">
            Chantier
            <select value={chantierId} onChange={(e) => setChantierId(Number(e.target.value))}>
              {chantiers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.numero_unique} — {c.adresse_chantier}
                </option>
              ))}
            </select>
          </label>

          <div className="card">
            <h3>Plan 2D</h3>
            <Plan2D facades={facades} />
          </div>

          <div className="card">
            <h3>Façades du chantier</h3>
            {facades.length === 0 ? (
              <p className="empty-state">Aucune façade pour l'instant</p>
            ) : (
              <ul className="liste-facades">
                {facades.map((f) => (
                  <li key={f.id}>
                    {f.nom} — {f.largeur}m × {f.hauteur}m ({f.type_forme})
                    {f.type_bardage && ` — ${f.type_bardage}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FacadeForm
            chantierId={chantierId}
            onFacadeCreated={() => chargerFacades(chantierId)}
          />
        </>
      )}
    </div>
  )
}
