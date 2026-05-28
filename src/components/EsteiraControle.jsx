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

// Canais opcionais que o usuário pode habilitar
const CANAIS_OPCIONAIS = [
  { key: 'SMS',      label: 'SMS' },
  { key: 'WHATSAPP', label: 'WhatsApp' },
  { key: 'FACEBOOK', label: 'Facebook' },
]

export default function EsteiraControle({ propostaId, statusAtual, onAcaoExecutada }) {
  const [acoes, setAcoes]           = useState([])
  const [observacao, setObservacao] = useState('')
  const [canais, setCanais]         = useState([])   // canais opcionais selecionados
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    buscarAcoes(propostaId)
      .then(r => setAcoes(r.data.acoesDisponiveis || []))
      .catch(() => setAcoes([]))
  }, [propostaId, statusAtual])

  function toggleCanal(key) {
    setCanais(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  async function handleAcao(acao) {
    setLoading(true)
    try {
      // EMAIL é sempre enviado pelo backend — passamos apenas os opcionais
      const r = await executarAcao(propostaId, acao, observacao, canais)
      toast.success(r.data.mensagem || 'Ação executada com sucesso!')
      setObservacao('')
      onAcaoExecutada()
    } catch (err) {
      toast.error(err?.response?.data?.mensagem || 'Erro ao executar ação.')
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
            {/* Observação */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Observação <span className="text-muted fw-normal">(opcional)</span>
              </label>
              <input
                className="form-control"
                value={observacao}
                onChange={e => setObservacao(e.target.value)}
                placeholder="Comentário sobre esta ação..."
                disabled={loading}
              />
            </div>

            {/* Canais de notificação */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Canais de Notificação</label>
              <div className="d-flex flex-wrap gap-3 align-items-center border rounded p-2 bg-light">

                {/* E-mail — sempre obrigatório, não pode desmarcar */}
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="canal-email"
                    checked
                    disabled
                  />
                  <label className="form-check-label text-muted" htmlFor="canal-email">
                    E-mail{' '}
                    <span className="badge bg-secondary ms-1" style={{ fontSize: '0.7rem' }}>
                      obrigatório
                    </span>
                  </label>
                </div>

                {/* Canais opcionais */}
                {CANAIS_OPCIONAIS.map(({ key, label }) => (
                  <div className="form-check mb-0" key={key}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`canal-${key}`}
                      checked={canais.includes(key)}
                      onChange={() => toggleCanal(key)}
                      disabled={loading}
                    />
                    <label className="form-check-label" htmlFor={`canal-${key}`}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="d-flex gap-2 flex-wrap">
              {acoes.map(acao => (
                <button
                  key={acao}
                  className={`btn ${BTN_VARIANT[acao] || 'btn-primary'}`}
                  onClick={() => handleAcao(acao)}
                  disabled={loading}
                >
                  {loading && <span className="spinner-border spinner-border-sm me-1" />}
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
