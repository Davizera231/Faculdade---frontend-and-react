import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { buscarCliente, criarCliente, atualizarCliente } from '../../api/clienteApi'

const INITIAL = { nome:'', cpfCnpj:'', email:'', telefone:'', endereco:'', cidade:'', estado:'', cep:'', tipo:'PESSOA_FISICA' }

export default function ClienteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [salvando, setSalvando] = useState(false)
  const editando = !!id

  useEffect(() => {
    if (editando) {
      buscarCliente(id)
        .then(r => setForm(r.data))
        .catch(() => toast.error('Erro ao carregar cliente.'))
    }
  }, [id])

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      if (editando) await atualizarCliente(id, form)
      else await criarCliente(form)
      toast.success(editando ? 'Cliente atualizado!' : 'Cliente cadastrado!')
      navigate('/clientes')
    } catch (err) {
      const msg = err?.response?.data?.erro || 'Erro ao salvar cliente.'
      toast.error(msg)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h1 className="h3 mb-4">{editando ? 'Editar Cliente' : 'Novo Cliente'}</h1>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} noValidate>

            <div className="mb-3">
              <label className="form-label fw-semibold">Nome *</label>
              <input className="form-control" name="nome" value={form.nome} onChange={handleChange} />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-8">
                <label className="form-label fw-semibold">CPF / CNPJ *</label>
                <input className="form-control" name="cpfCnpj" value={form.cpfCnpj} onChange={handleChange} disabled={editando} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Tipo</label>
                <select className="form-select" name="tipo" value={form.tipo} onChange={handleChange}>
                  <option value="PESSOA_FISICA">Pessoa Física</option>
                  <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                </select>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-7">
                <label className="form-label fw-semibold">E-mail</label>
                <input className="form-control" name="email" type="text" value={form.email} onChange={handleChange} />
              </div>
              <div className="col-md-5">
                <label className="form-label fw-semibold">Telefone</label>
                <input className="form-control" name="telefone" value={form.telefone} onChange={handleChange} />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Endereço</label>
              <input className="form-control" name="endereco" value={form.endereco} onChange={handleChange} />
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <label className="form-label fw-semibold">Cidade</label>
                <input className="form-control" name="cidade" value={form.cidade} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Estado (UF)</label>
                <input className="form-control text-uppercase" name="estado" maxLength={2} value={form.estado} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">CEP</label>
                <input className="form-control" name="cep" value={form.cep} onChange={handleChange} />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/clientes')}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={salvando}>
                {salvando ? <span className="spinner-border spinner-border-sm me-1"/> : null}
                Salvar Cliente
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
