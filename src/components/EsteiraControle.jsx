import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { buscarAcoes, executarAcao } from '../api/esteiraApi'

const LABEL = {
  ENVIAR_ANALISE: 'Enviar para Análise',
  APROVAR:        'Aprovar',
  REPROVAR:       'Reprovar',
  REABRIR:        'Reabrir'
}

const BTN_VARIANT = {
  ENVIAR_ANALISE: 'btn-primary',
  APROVAR:        'btn-success',
  REPROVAR:       'btn-danger',
  REABRIR:        'btn-warning'
}

export default function EsteiraControle({ propostaId, statusAtual, onAcaoExecutada }) {
  const [acoes, setAcoes] = useState([])
  const [observacao, setObservacao] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    buscarAcoes(propostaId)
      .then(r => setAcoes(r.data.acoesDisponiveis || []))
      .catch(() => setAcoes([]))
  }, [propostaId, statusAtual])

  async function handleAcao(acao) {
    setLoading(true)
    try {
      const r = await executarAcao(propostaId, acao, observacao)
      toast.success(r.data.mensagem || 'Ação executada com sucesso!')
      setObservacao('')
      onAcaoExecutada()
    } catch (err) {
      toast.error(err.mensagem || 'Erro ao executar ação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card shadow-sm esteira-card">
      <div className="card-header bg-white fw-semibold">Esteira de Aprovação</div>
      <div className="card-body">
        {acoes.length === 0 ? (
          <p className="text-muted mb-0">
            Nenhuma ação disponível para o status <strong>{statusAtual}</strong>.
          </p>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label fw-semibold">Observação <span className="text-muted fw-normal">(opcional)</span></label>
              <input
                className="form-control"
                value={observacao}
                onChange={e => setObservacao(e.target.value)}
                placeholder="Comentário sobre esta ação..."
                disabled={loading}
              />
            </div>

            <div className="d-flex gap-2 flex-wrap">
              {acoes.map(acao => (
                <button
                  key={acao}
                  className={`btn ${BTN_VARIANT[acao] || 'btn-primary'}`}
                  onClick={() => handleAcao(acao)}
                  disabled={loading}
                >
                  {loading
                    ? <span className="spinner-border spinner-border-sm me-1"/>
                    : null}
                  {LABEL[acao] || acao}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
