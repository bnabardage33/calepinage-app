import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getChantiers } from '../api/client'

export default function Chantiers() {
  const [chantiers, setChantiers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getChantiers()
      .then(setChantiers)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Chargement...</p>

  return (
    <div>
      <h1>Chantiers</h1>
      <ul>
        {chantiers.map((c) => (
          <li key={c.id}>
            <Link to={`/chantiers/${c.id}`}>
              {c.numero_unique} — {c.adresse_chantier}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
