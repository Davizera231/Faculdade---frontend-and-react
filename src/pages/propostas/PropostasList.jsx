import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { listarPropostas, deletarProposta } from '../../api/propostaApi'

const STATUS_LIST  = ['RASCUNHO', 'ANALISE', 'APROVADA', 'REPROVADA']
const STATUS_BADGE = {
  RASCUNHO:  'badge-rascunho',
  ANALISE:   'badge-analise',
  APROVADA:  'badge-aprovada',
  REPROVADA: 'badge-reprovada',
}

const FILTRO_INICIAL = { status: '', codigo: '', dataInicio: '', dataFim: '' }

export default function PropostasList() {
  const [propostas, setPropostas] = useState([])
  const [filtro, setFiltro]       = useState(FILTRO_INICIAL)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const r = await listarPropostas()
      setPropostas(r.data)
    } catch {
      toast.error('Erro ao carregar propostas.')
    }
  }

  async function handleDeletar(id) {
    if (!confirm('Excluir proposta e todos os documentos vinculados?')) return
    try {
      await deletarProposta(id)
      toast.success('Proposta excluída com sucesso.')
      carregar()
    } catch (err) {
      toast.error(err?.response?.data?.erro || 'Erro ao excluir proposta.')
    }
  }

  function handleFiltro(e) {
    const { name, value } = e.target
    setFiltro(prev => ({ ...prev, [name]: value }))
  }

  function limparFiltros() {
    setFiltro(FILTRO_INICIAL)
  }

  // Filtragem client-side — sem chamada extra ao backend
  const propostasFiltradas = useMemo(() => {
    return propostas.filter(p => {
      // Filtro status
      if (filtro.status && p.status !== filtro.status) return false

      // Filtro código (busca parcial, case-insensitive)
      if (filtro.codigo.trim()) {
        const busca = filtro.codigo.trim().toLowerCase()
        if (!p.codigo?.toLowerCase().includes(busca)) return false
      }

      // Filtro data de criação — início
      if (filtro.dataInicio) {
        const inicio = new Date(filtro.dataInicio + 'T00:00:00')
        if (new Date(p.dataCriacao) < inicio) return false
      }

      // Filtro data de criação — fim
      if (filtro.dataFim) {
        const fim = new Date(filtro.dataFim + 'T23:59:59')
        if (new Date(p.dataCriacao) > fim) return false
      }

      return true
    })
  }, [propostas, filtro])

  const filtroAtivo = filtro.status || filtro.codigo || filtro.dataInicio || filtro.dataFim

  return (
    <div className="container mt-4">

      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Propostas</h1>
        <Link className="btn btn-primary" to="/propostas/nova">+ Nova Proposta</Link>
      </div>

      {/* Painel de filtros */}
      <div className="card shadow-sm mb-3">
        <div className="card-body py-3">
          <div className="row g-3 align-items-end">

            {/* Filtro por status */}
            <div className="col-12 col-md-auto">
              <label className="form-label fw-semibold mb-1 d-block">Status</label>
              <div className="d-flex gap-1 flex-wrap">
                <button
                  className={`btn btn-sm ${filtro.status === '' ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setFiltro(prev => ({ ...prev, status: '' }))}
                >
                  Todos
                </button>
                {STATUS_LIST.map(s => (
                  <button
                    key={s}
                    className={`btn btn-sm ${filtro.status === s ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => setFiltro(prev => ({ ...prev, status: s }))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por código */}
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold mb-1">Código</label>
              <input
                className="form-control form-control-sm"
                name="codigo"
                placeholder="Ex: PROP-20260602"
                value={filtro.codigo}
                onChange={handleFiltro}
              />
            </div>

            {/* Filtro por data — início */}
            <div className="col-6 col-md-2">
              <label className="form-label fw-semibold mb-1">Data de</label>
              <input
                className="form-control form-control-sm"
                type="date"
                name="dataInicio"
                value={filtro.dataInicio}
                onChange={handleFiltro}
              />
            </div>

            {/* Filtro por data — fim */}
            <div className="col-6 col-md-2">
              <label className="form-label fw-semibold mb-1">Data até</label>
              <input
                className="form-control form-control-sm"
                type="date"
                name="dataFim"
                value={filtro.dataFim}
                onChange={handleFiltro}
              />
            </div>

            {/* Botão limpar */}
            {filtroAtivo && (
              <div className="col-auto">
                <button className="btn btn-sm btn-outline-danger" onClick={limparFiltros}>
                  Limpar filtros
                </button>
              </div>
            )}

          </div>

          {/* Contador de resultados */}
          <div className="mt-2 text-muted small">
            {propostasFiltradas.length} proposta{propostasFiltradas.length !== 1 ? 's' : ''} encontrada{propostasFiltradas.length !== 1 ? 's' : ''}
            {filtroAtivo && ` (de ${propostas.length} no total)`}
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Criada em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {propostasFiltradas.map(p => (
                <tr key={p.id}>
                  <td><code>{p.codigo}</code></td>
                  <td>{p.titulo}</td>
                  <td>{p.cliente?.nome}</td>
                  <td>R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td><span className={`badge ${STATUS_BADGE[p.status]}`}>{p.status}</span></td>
                  <td className="text-muted small">{new Date(p.dataCriacao).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <Link className="btn btn-sm btn-outline-primary me-1" to={`/propostas/${p.id}`}>Ver</Link>
                    {p.status === 'RASCUNHO' && (
                      <Link className="btn btn-sm btn-outline-secondary me-1" to={`/propostas/${p.id}/editar`}>Editar</Link>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletar(p.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {propostasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    {filtroAtivo ? 'Nenhuma proposta encontrada para os filtros aplicados.' : 'Nenhuma proposta cadastrada.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
