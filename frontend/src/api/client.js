import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
})

export const getChantiers = () => api.get('/chantiers').then((r) => r.data)
export const getChantier = (id) => api.get(`/chantiers/${id}`).then((r) => r.data)
export const createChantier = (data) => api.post('/chantiers', data).then((r) => r.data)

export const getClients = () => api.get('/clients').then((r) => r.data)
export const createClient = (data) => api.post('/clients', data).then((r) => r.data)

export const getFacades = (chantierId) =>
  api.get(`/chantiers/${chantierId}/facades`).then((r) => r.data)
export const createFacade = (data) => api.post('/facades', data).then((r) => r.data)

export const calculerMetre = (facadeId, margeChutePourcentage = 0) =>
  api
    .post(`/facades/${facadeId}/metre`, {
      marge_chute_pourcentage: margeChutePourcentage,
    })
    .then((r) => r.data)
