import { useEffect, useState } from 'react'
import { getClients, createClient } from '../api/client'

const FORME_INITIALE = {
  nom: '',
  societe: '',
  telephone: '',
  email: '',
  adresse: '',
}

export default function Clients() {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState(FORME_INITIALE)
  const [chargement, setChargement] = useState(true)
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState(null)

  const chargerClients = () => {
    getClients()
      .then(setClients)
      .finally(() => setChargement(false))
  }

  useEffect(chargerClients, [])

  const majChamp = (champ) => (e) =>
    setForm((f) => ({ ...f, [champ]: e.target.value }))

  const soumettre = async (e) => {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await createClient(form)
      setForm(FORME_INITIALE)
      chargerClients()
    } catch (err) {
      setErreur(
        err.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : 'Erreur lors de la création du client.'
      )
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div>
      <h1>Clients</h1>

      {chargement ? (
        <p>Chargement...</p>
      ) : clients.length === 0 ? (
        <p>Aucun client pour l'instant.</p>
      ) : (
        <table className="clients-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Société</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Adresse</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.nom}</td>
                <td>{c.societe}</td>
                <td>{c.telephone}</td>
                <td>{c.email}</td>
                <td>{c.adresse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Nouveau client</h2>
      <form onSubmit={soumettre} className="client-form">
        <label>
          Nom *
          <input type="text" value={form.nom} onChange={majChamp('nom')} required />
        </label>
        <label>
          Société
          <input type="text" value={form.societe} onChange={majChamp('societe')} />
        </label>
        <label>
          Téléphone
          <input type="text" value={form.telephone} onChange={majChamp('telephone')} />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={majChamp('email')} />
        </label>
        <label>
          Adresse
          <input type="text" value={form.adresse} onChange={majChamp('adresse')} />
        </label>
        <button type="submit" disabled={enCours}>
          {enCours ? 'Création...' : 'Créer le client'}
        </button>
      </form>
      {erreur && <p className="erreur">{erreur}</p>}
    </div>
  )
}
