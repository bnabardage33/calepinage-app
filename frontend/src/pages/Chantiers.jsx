import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getChantiers, getClients, createChantier } from '../api/client'

const FORME_INITIALE = {
  numero_unique: '',
  client_id: '',
  adresse_chantier: '',
  statut: 'en_cours',
}

export default function Chantiers() {
  const [chantiers, setChantiers] = useState([])
  const [clients, setClients] = useState([])
  const [form, setForm] = useState(FORME_INITIALE)
  const [chargement, setChargement] = useState(true)
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState(null)

  const charger = () => {
    Promise.all([getChantiers(), getClients()]).then(([c, cl]) => {
      setChantiers(c)
      setClients(cl)
      setChargement(false)
    })
  }

  useEffect(charger, [])

  const majChamp = (champ) => (e) =>
    setForm((f) => ({ ...f, [champ]: e.target.value }))

  const soumettre = async (e) => {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await createChantier({ ...form, client_id: Number(form.client_id) })
      setForm(FORME_INITIALE)
      charger()
    } catch (err) {
      setErreur(
        err.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : 'Erreur lors de la création du chantier.'
      )
    } finally {
      setEnCours(false)
    }
  }

  if (chargement) return <p>Chargement...</p>

  return (
    <div>
      <h1>Chantiers</h1>

      {chantiers.length === 0 ? (
        <p>Aucun chantier pour l'instant.</p>
      ) : (
        <ul>
          {chantiers.map((c) => (
            <li key={c.id}>
              <Link to={`/chantiers/${c.id}`}>
                {c.numero_unique} — {c.adresse_chantier} ({c.statut})
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2>Nouveau chantier</h2>
      {clients.length === 0 ? (
        <p>
          Il faut d'abord <Link to="/clients">créer un client</Link> avant de pouvoir
          créer un chantier.
        </p>
      ) : (
        <form onSubmit={soumettre} className="chantier-form">
          <label>
            Numéro unique *
            <input
              type="text"
              value={form.numero_unique}
              onChange={majChamp('numero_unique')}
              placeholder="CH-2026-001"
              required
            />
          </label>
          <label>
            Client *
            <select value={form.client_id} onChange={majChamp('client_id')} required>
              <option value="">-- Choisir un client --</option>
              {clients.map((cl) => (
                <option key={cl.id} value={cl.id}>
                  {cl.nom} {cl.societe ? `(${cl.societe})` : ''}
                </option>
              ))}
            </select>
          </label>
          <label>
            Adresse du chantier *
            <input
              type="text"
              value={form.adresse_chantier}
              onChange={majChamp('adresse_chantier')}
              required
            />
          </label>
          <label>
            Statut
            <select value={form.statut} onChange={majChamp('statut')}>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
              <option value="archive">Archivé</option>
            </select>
          </label>
          <button type="submit" disabled={enCours}>
            {enCours ? 'Création...' : 'Créer le chantier'}
          </button>
        </form>
      )}
      {erreur && <p className="erreur">{erreur}</p>}
    </div>
  )
}
