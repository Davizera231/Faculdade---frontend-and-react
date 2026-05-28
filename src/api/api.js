import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:8080/api', headers: { 'Content-Type': 'application/json' } })
api.interceptors.response.use(res => res, err => {
  const mensagem = err.response?.data?.erro || err.message || 'Erro desconhecido'
  return Promise.reject({ ...err, mensagem })
})
export default api
