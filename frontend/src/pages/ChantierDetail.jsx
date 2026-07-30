import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getChantier, getFacades, calculerMetre } from '../api/client'
import FacadeForm from '../components/FacadeForm'
import MetreResult from '../components/MetreResult'

export default function ChantierDetail() {
  const { id } = useParams()
  const [chantier, setChantier] = useState(null)
  const [facades, setFacades] = useState([])
  const [metresParFacade, setMetresParFacade] = useState({})

  const chargerFacades = () => {
    getFacades(id).then(setFacades)
  }

  useEffect(() => {
    getChantier(id).then(setChantier)
    chargerFacades()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const voirMetre = async (facadeId) => {
    const resultat = await calculerMetre(facadeId, 0)
    setMetresParFacade((m) => ({ ...m, [facadeId]: resultat }))
  }

  if (!chantier) return <p>Chargement...</p>

  return (
    <div>
      <h1>{chantier.numero_unique}</h1>
      <p>{chantier.adresse_chantier}</p>
      <p>Statut : {chantier.statut}</p>

      <h2>Façades</h2>
      <ul className="liste-facades">
        {facades.map((f) => (
          <li key={f.id}>
            <div>
              {f.nom} — {f.largeur}m x {f.hauteur}m ({f.type_forme})
              {f.type_bardage && ` — ${f.type_bardage}`}
            </div>
            {f.type_bardage && (
              <button onClick={() => voirMetre(f.id)}>Calculer le métré</button>
            )}
            {metresParFacade[f.id] && <MetreResult metre={metresParFacade[f.id]} />}
          </li>
        ))}
      </ul>

      <FacadeForm chantierId={Number(id)} onFacadeCreated={chargerFacades} />
    </div>
  )
}
