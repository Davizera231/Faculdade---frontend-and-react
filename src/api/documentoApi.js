import api from './api'

export const listarDocumentos = (propostaId) =>
    api.get(`/documentos/proposta/${propostaId}`)

export const uploadDocumento = (propostaId, arquivo, descricao = '') => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)
    if (descricao) formData.append('descricao', descricao)
    return api.post(`/documentos/proposta/${propostaId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export const downloadDocumento = (docId) =>
    api.get(`/documentos/${docId}/download`, { responseType: 'blob' })

export const deletarDocumento = (docId) =>
    api.delete(`/documentos/${docId}`)
