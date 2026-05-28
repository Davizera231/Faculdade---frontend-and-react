import api from './api'
export const executarAcao = (propostaId, acao, observacao) => api.post(`/esteira/${propostaId}/${acao}`, { observacao })
export const buscarAcoes  = (propostaId)                   => api.get(`/esteira/${propostaId}/acoes`)
