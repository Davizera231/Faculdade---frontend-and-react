import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { buscarProposta } from '../../api/propostaApi'
import EsteiraControle from '../../components/EsteiraControle'

const STATUS_BADGE = { RASCUNHO:'badge-rascunho', ANALISE:'badge-analise', APROVADA:'badge-aprovada', REPROVADA:'badge-reprovada' }

export default function PropostaDetalhe() {
  const { id } = useParams()
  const [proposta, setProposta] = useState(null)

  useEffect(() => { carregar() }, [id])

  async function carregar() {
    try {
      const r = await buscarProposta(id)
      setProposta(r.data)
    } catch {
      toast.error('Proposta não encontrada.')
    }
  }

  if (!proposta) return <div className="container mt-4"><p className="text-muted">Carregando...</p></div>

  const fmt = v => v ? new Date(v).toLocaleString('pt-BR') : '—'

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Proposta <code>{proposta.codigo}</code></h1>
        <Link className="btn btn-outline-secondary" to="/propostas">← Voltar</Link>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white fw-semibold">Dados da Proposta</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex"><span className="detail-label">Título</span><strong>{proposta.titulo}</strong></li>
          <li className="list-group-item d-flex"><span className="detail-label">Status</span><span className={`badge ${STATUS_BADGE[proposta.status]}`}>{proposta.status}</span></li>
          <li className="list-group-item d-flex"><span className="detail-label">Etapa atual</span><span>{proposta.etapaAtual}</span></li>
          <li className="list-group-item d-flex"><span className="detail-label">Valor</span><strong>R$ {Number(proposta.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></li>
          <li className="list-group-item d-flex"><span className="detail-label">Cliente</span><span>{proposta.cliente?.nome} <span className="text-muted small">({proposta.cliente?.cpfCnpj})</span></span></li>
          <li className="list-group-item d-flex"><span className="detail-label">Descrição</span><span>{proposta.descricao || '—'}</span></li>
          <li className="list-group-item d-flex"><span className="detail-label">Observações</span><span>{proposta.observacoes || '—'}</span></li>
          <li className="list-group-item d-flex"><span className="detail-label">Criada em</span><span>{fmt(proposta.dataCriacao)}</span></li>
          <li className="list-group-item d-flex"><span className="detail-label">Atualizada em</span><span>{fmt(proposta.dataAtualizacao)}</span></li>
        </ul>
      </div>

      <EsteiraControle
        propostaId={proposta.id}
        statusAtual={proposta.status}
        onAcaoExecutada={carregar}
      />
    </div>
  )
}
