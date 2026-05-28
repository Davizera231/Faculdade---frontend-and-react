import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { listarPropostas, deletarProposta } from '../../api/propostaApi'

const STATUS_LIST = ['', 'RASCUNHO', 'ANALISE', 'APROVADA', 'REPROVADA']
const STATUS_BADGE = { RASCUNHO: 'badge-rascunho', ANALISE: 'badge-analise', APROVADA: 'badge-aprovada', REPROVADA: 'badge-reprovada' }

export default function PropostasList() {
  const [propostas, setPropostas] = useState([])
  const [filtro, setFiltro] = useState('')

  useEffect(() => { carregar() }, [filtro])

  async function carregar() {
    try {
      const r = await listarPropostas(filtro)
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
      toast.error(err.mensagem || 'Erro ao excluir proposta.')
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Propostas</h1>
        <Link className="btn btn-primary" to="/propostas/nova">+ Nova Proposta</Link>
      </div>

      <div className="mb-3 d-flex gap-2 align-items-center flex-wrap">
        <span className="text-muted small">Filtrar:</span>
        {STATUS_LIST.map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filtro === s ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFiltro(s)}
          >
            {s || 'Todos'}
          </button>
        ))}
      </div>

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
                <th>Atualizada</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {propostas.map(p => (
                <tr key={p.id}>
                  <td><code>{p.codigo}</code></td>
                  <td>{p.titulo}</td>
                  <td>{p.cliente?.nome}</td>
                  <td>R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td><span className={`badge ${STATUS_BADGE[p.status]}`}>{p.status}</span></td>
                  <td className="text-muted small">{new Date(p.dataAtualizacao).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <Link className="btn btn-sm btn-outline-primary me-1" to={`/propostas/${p.id}`}>Ver</Link>
                    {p.status === 'RASCUNHO' && (
                      <Link className="btn btn-sm btn-outline-secondary me-1" to={`/propostas/${p.id}/editar`}>Editar</Link>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletar(p.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {propostas.length === 0 && (
                <tr><td colSpan={7} className="text-center text-muted py-4">Nenhuma proposta encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
