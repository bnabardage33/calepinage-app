import axios from 'axios'

// L'URL du backend sur Render
const API_BASE = import.meta.env.VITE_API_URL || 'https://ton-backend.onrender.com/api'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ===== CLIENTS =====
export const getClients = () => api.get('/clients').then(r => r.data)
export const getClient = (id) => api.get(`/clients/${id}`).then(r => r.data)
export const createClient = (data) => api.post('/clients', data).then(r => r.data)

// ===== CHANTIERS =====
export const getChantiers = () => api.get('/chantiers').then(r => r.data)
export const getChantier = (id) => api.get(`/chantiers/${id}`).then(r => r.data)
export const createChantier = (data) => api.post('/chantiers', data).then(r => r.data)

// ===== FAÇADES =====
export const getFacades = (chantierId) =>
  api.get(`/chantiers/${chantierId}/facades`).then(r => r.data)

export const createFacade = (data) =>
  api.post('/facades', data).then(r => r.data)

// ===== MÉTRÉ =====
export const calculerMetre = (facadeId, margeChutePourcentage = 0) =>
  api.post(`/facades/${facadeId}/metre`, {
    marge_chute_pourcentage: margeChutePourcentage,
  }).then(r => r.data)

// ===== STATS POUR LE DASHBOARD =====
export const getDashboardStats = () =>
  Promise.all([getChantiers(), getClients()])
    .then(([chantiers, clients]) => {
      const enCours = chantiers.filter(c => c.statut === 'en_cours')
      const caTotal = chantiers.reduce((acc, c) => acc + (c.montant_estime || 0), 0)

      return {
        totalChantiers: chantiers.length,
        enCours: enCours.length,
        totalClients: clients.length,
        caTotal: caTotal,
        chantiersEnCours: enCours.slice(0, 5), // les 5 premiers
        chantiers: chantiers,
        clients: clients,
      }
    })
