import api from './api'
export const listarClientes   = ()       => api.get('/clientes')
export const buscarCliente    = (id)     => api.get(`/clientes/${id}`)
export const criarCliente     = (data)   => api.post('/clientes', data)
export const atualizarCliente = (id, d)  => api.put(`/clientes/${id}`, d)
export const deletarCliente   = (id)     => api.delete(`/clientes/${id}`)
