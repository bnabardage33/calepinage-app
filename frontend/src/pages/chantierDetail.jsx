import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getChantier, getFacades } from '../api/client'

export default function ChantierDetail() {
  const { id } = useParams()
  const [chantier, setChantier] = useState(null)
  const [facades, setFacades] = useState([])

  useEffect(() => {
    getChantier(id).then(setChantier)
    getFacades(id).then(setFacades)
  }, [id])

  if (!chantier) return <p>Chargement...</p>

  return (
    <div>
      <h1>{chantier.numero_unique}</h1>
      <p>{chantier.adresse_chantier}</p>
      <p>Statut : {chantier.statut}</p>

      <h2>Façades</h2>
      <ul>
        {facades.map((f) => (
          <li key={f.id}>
            {f.nom} — {f.largeur}m x {f.hauteur}m ({f.type_forme})
          </li>
        ))}
      </ul>
    </div>
  )
}
