import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { buscarProposta, criarProposta, atualizarProposta } from '../../api/propostaApi'
import { listarClientes } from '../../api/clienteApi'

const INITIAL = { codigo:'', titulo:'', descricao:'', valor:'', observacoes:'', cliente:{ id:'' } }

export default function PropostaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [clientes, setClientes] = useState([])
  const [salvando, setSalvando] = useState(false)
  const editando = !!id

  useEffect(() => {
    listarClientes().then(r => setClientes(r.data)).catch(() => toast.error('Erro ao carregar clientes.'))
    if (editando) buscarProposta(id).then(r => setForm(r.data)).catch(() => toast.error('Erro ao carregar proposta.'))
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'clienteId') setForm(prev => ({ ...prev, cliente: { id: parseInt(value) } }))
    else setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      if (editando) await atualizarProposta(id, form)
      else await criarProposta(form)
      toast.success(editando ? 'Proposta atualizada!' : 'Proposta criada com sucesso!')
      navigate('/propostas')
    } catch (err) {
      toast.error(err.mensagem || 'Erro ao salvar proposta.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h1 className="h3 mb-4">{editando ? 'Editar Proposta' : 'Nova Proposta'}</h1>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Código *</label>
                <input className="form-control" name="codigo" value={form.codigo} onChange={handleChange} required disabled={editando} placeholder="Ex: PROP-2024-001" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Valor (R$) *</label>
                <div className="input-group">
                  <span className="input-group-text">R$</span>
                  <input className="form-control" name="valor" type="number" step="0.01" min="0.01" value={form.valor} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Título *</label>
              <input className="form-control" name="titulo" value={form.titulo} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Descrição</label>
              <textarea className="form-control" name="descricao" value={form.descricao || ''} onChange={handleChange} rows={3} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Cliente *</label>
              <select className="form-select" name="clienteId" value={form.cliente?.id || ''} onChange={handleChange} required>
                <option value="">Selecione um cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.cpfCnpj}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Observações</label>
              <textarea className="form-control" name="observacoes" value={form.observacoes || ''} onChange={handleChange} rows={2} />
            </div>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/propostas')}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={salvando}>
                {salvando ? <span className="spinner-border spinner-border-sm me-1"/> : null}
                Salvar Proposta
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
