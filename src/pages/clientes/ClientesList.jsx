import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { listarClientes, deletarCliente } from '../../api/clienteApi'

export default function ClientesList() {
  const [clientes, setClientes] = useState([])

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const r = await listarClientes()
      setClientes(r.data)
    } catch {
      toast.error('Erro ao carregar clientes.')
    }
  }

  async function handleDeletar(id) {
    if (!confirm('Confirma exclusão do cliente?')) return
    try {
      await deletarCliente(id)
      toast.success('Cliente excluído com sucesso.')
      carregar()
    } catch (err) {
      toast.error(err.mensagem || 'Erro ao excluir cliente.')
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Clientes</h1>
        <Link className="btn btn-primary" to="/clientes/novo">+ Novo Cliente</Link>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nome</th>
                <th>CPF / CNPJ</th>
                <th>Tipo</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.nome}</strong></td>
                  <td><code>{c.cpfCnpj}</code></td>
                  <td>
                    <span className={`badge ${c.tipo === 'PESSOA_FISICA' ? 'bg-info text-dark' : 'bg-success'}`}>
                      {c.tipo === 'PESSOA_FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </span>
                  </td>
                  <td>{c.email || '—'}</td>
                  <td>{c.telefone || '—'}</td>
                  <td>
                    <Link className="btn btn-sm btn-outline-secondary me-1" to={`/clientes/${c.id}/editar`}>Editar</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletar(c.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">Nenhum cliente cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
