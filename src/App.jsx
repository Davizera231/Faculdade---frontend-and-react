import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header'
import PropostasList   from './pages/propostas/PropostasList'
import PropostaForm    from './pages/propostas/PropostaForm'
import PropostaDetalhe from './pages/propostas/PropostaDetalhe'
import ClientesList    from './pages/clientes/ClientesList'
import ClienteForm     from './pages/clientes/ClienteForm'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"                     element={<Navigate to="/propostas" />} />
        <Route path="/propostas"            element={<PropostasList />} />
        <Route path="/propostas/nova"       element={<PropostaForm />} />
        <Route path="/propostas/:id"        element={<PropostaDetalhe />} />
        <Route path="/propostas/:id/editar" element={<PropostaForm />} />
        <Route path="/clientes"             element={<ClientesList />} />
        <Route path="/clientes/novo"        element={<ClienteForm />} />
        <Route path="/clientes/:id/editar"  element={<ClienteForm />} />
        <Route path="*"                     element={<Navigate to="/propostas" />} />
      </Routes>

      {/* Toast global — position e duração configuráveis */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  )
}
