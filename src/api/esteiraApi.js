import api from './api'
// canais: lista de canais opcionais selecionados ex: ['SMS','WHATSAPP']
// EMAIL é sempre incluído pelo backend — não precisa passar aqui
export const executarAcao = (propostaId, acao, observacao, canais = []) =>
    api.post(`/esteira/${propostaId}/${acao}`, { observacao, canais })
export const buscarAcoes  = (propostaId)                   => api.get(`/esteira/${propostaId}/acoes`)
