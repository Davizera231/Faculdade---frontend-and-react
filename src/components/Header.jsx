import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const active = (path) => pathname.startsWith(path) ? 'active' : ''

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <span className="navbar-brand">📋 Esteira de Propostas</span>
      <div className="navbar-nav ms-auto">
        <Link className={`nav-link ${active('/propostas')}`} to="/propostas">Propostas</Link>
        <Link className={`nav-link ${active('/clientes')}`}  to="/clientes">Clientes</Link>
      </div>
    </nav>
  )
}
