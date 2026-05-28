import api from './api'
export const listarPropostas   = (status) => api.get('/propostas', { params: status ? { status } : {} })
export const buscarProposta    = (id)     => api.get(`/propostas/${id}`)
export const criarProposta     = (data)   => api.post('/propostas', data)
export const atualizarProposta = (id, d)  => api.put(`/propostas/${id}`, d)
export const deletarProposta   = (id)     => api.delete(`/propostas/${id}`)
