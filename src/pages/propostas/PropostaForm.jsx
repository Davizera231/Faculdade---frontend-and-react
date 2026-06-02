import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { buscarProposta, criarProposta, atualizarProposta } from '../../api/propostaApi'
import { uploadDocumento } from '../../api/documentoApi'
import { listarClientes } from '../../api/clienteApi'

const INITIAL = { titulo: '', descricao: '', valor: '', observacoes: '', cliente: { id: '' } }

export default function PropostaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm]         = useState(INITIAL)
  const [clientes, setClientes] = useState([])
  const [arquivo, setArquivo]   = useState(null)
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

  function handleArquivo(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são aceitos.')
      e.target.value = ''
      setArquivo(null)
      return
    }
    setArquivo(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      if (editando) {
        await atualizarProposta(id, form)
        if (arquivo) await uploadDocumento(id, arquivo)
        toast.success('Proposta atualizada!')
      } else {
        const res = await criarProposta(form)
        const novaId = res.data.id
        await uploadDocumento(novaId, arquivo)
        toast.success(`Proposta criada! Código: ${res.data.codigo}`)
      }
      navigate('/propostas')
    } catch (err) {
      const msg = err?.response?.data?.erro || 'Erro ao salvar proposta.'
      toast.error(msg)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h1 className="h3 mb-4">{editando ? 'Editar Proposta' : 'Nova Proposta'}</h1>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} noValidate>

            {/* Valor + Título */}
            <div className="row g-3 mb-3">
              <div className="col-md-5">
                <label className="form-label fw-semibold">Valor (R$) *</label>
                <div className="input-group">
                  <span className="input-group-text">R$</span>
                  <input
                    className="form-control"
                    name="valor"
                    type="number"
                    step="0.01"
                    value={form.valor}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-7">
                <label className="form-label fw-semibold">Título *</label>
                <input
                  className="form-control"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Descrição</label>
              <textarea
                className="form-control"
                name="descricao"
                value={form.descricao || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Cliente */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Cliente *</label>
              <select
                className="form-select"
                name="clienteId"
                value={form.cliente?.id || ''}
                onChange={handleChange}
              >
                <option value="">Selecione um cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome} — {c.cpfCnpj}</option>
                ))}
              </select>
            </div>

            {/* Observações */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Observações</label>
              <textarea
                className="form-control"
                name="observacoes"
                value={form.observacoes || ''}
                onChange={handleChange}
                rows={2}
              />
            </div>

            {/* Documento PDF */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Documento PDF{' '}
                {!editando
                  ? <span className="text-danger">*</span>
                  : <span className="text-muted fw-normal">(opcional — substitui o atual)</span>
                }
              </label>
              <input
                className="form-control"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleArquivo}
              />
              {arquivo && (
                <div className="form-text text-success mt-1">
                  ✔ {arquivo.name} ({(arquivo.size / 1024).toFixed(1)} KB)
                </div>
              )}
              <div className="form-text text-muted">Apenas arquivos .pdf — máximo 10 MB</div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/propostas')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={salvando}>
                {salvando && <span className="spinner-border spinner-border-sm me-1" />}
                Salvar Proposta
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
