import { useState } from 'react'
import { createFacade, calculerMetre } from '../api/client'
import MetreResult from './MetreResult'

const TYPES_BARDAGE = [
  { value: 'composite', label: 'Composite (clips)' },
  { value: 'bois_naturel', label: 'Bois naturel' },
  { value: 'metallique_tole', label: 'Métallique tôle (simple peau)' },
  { value: 'metallique_cassette', label: 'Métallique cassette' },
  { value: 'panneau_sandwich', label: 'Panneau sandwich' },
  { value: 'hpl_fibrociment', label: 'HPL / Fibrociment' },
]

const FORME_INITIALE = {
  nom: '',
  type_forme: 'rectangle',
  largeur: '',
  hauteur: '',
  orientation: '',
  type_bardage: 'composite',
}

export default function FacadeForm({ chantierId, onFacadeCreated }) {
  const [form, setForm] = useState(FORME_INITIALE)
  const [margeChute, setMargeChute] = useState(0)
  const [metre, setMetre] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  const majChamp = (champ) => (e) =>
    setForm((f) => ({ ...f, [champ]: e.target.value }))

  const soumettre = async (e) => {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    setMetre(null)

    try {
      const facade = await createFacade({
        chantier_id: chantierId,
        nom: form.nom,
        type_forme: form.type_forme,
        largeur: parseFloat(form.largeur),
        hauteur: parseFloat(form.hauteur),
        orientation: form.orientation || null,
        type_bardage: form.type_bardage,
      })

      const resultatMetre = await calculerMetre(facade.id, parseFloat(margeChute) || 0)
      setMetre(resultatMetre)

      if (onFacadeCreated) onFacadeCreated(facade)
      setForm(FORME_INITIALE)
    } catch (err) {
      setErreur(
        err.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : 'Erreur lors de la création de la façade.'
      )
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div className="facade-form">
      <h3>Nouvelle façade</h3>
      <form onSubmit={soumettre}>
        <label>
          Nom
          <input type="text" value={form.nom} onChange={majChamp('nom')} required />
        </label>

        <label>
          Type de forme
          <select value={form.type_forme} onChange={majChamp('type_forme')}>
            <option value="rectangle">Rectangle</option>
            <option value="pignon">Pignon</option>
            <option value="forme_libre">Forme libre</option>
          </select>
        </label>

        <label>
          Largeur (m)
          <input
            type="number"
            step="0.01"
            value={form.largeur}
            onChange={majChamp('largeur')}
            required
          />
        </label>

        <label>
          Hauteur (m)
          <input
            type="number"
            step="0.01"
            value={form.hauteur}
            onChange={majChamp('hauteur')}
            required
          />
        </label>

        <label>
          Orientation
          <input type="text" value={form.orientation} onChange={majChamp('orientation')} />
        </label>

        <label>
          Type de bardage
          <select value={form.type_bardage} onChange={majChamp('type_bardage')} required>
            {TYPES_BARDAGE.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Marge de chute (%)
          <input
            type="number"
            step="1"
            min="0"
            value={margeChute}
            onChange={(e) => setMargeChute(e.target.value)}
          />
        </label>

        <button type="submit" disabled={enCours}>
          {enCours ? 'Calcul en cours...' : 'Créer et calculer le métré'}
        </button>
      </form>

      {erreur && <p className="erreur">{erreur}</p>}
      {metre && <MetreResult metre={metre} />}
    </div>
  )
}
