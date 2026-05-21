import { Link, Outlet } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="brand" aria-label="Atlas Saúde — início">
          <span className="brand-icon" aria-hidden>
            <Stethoscope size={18} strokeWidth={2.4} />
          </span>
          <span>
            Atlas<span className="brand-mark"> Saúde</span>
          </span>
        </Link>
        <nav className="nav">
          <Link to="/">Início</Link>
          <Link to="/dashboard">Meu plano</Link>
          <Link to="/pacientes">Pacientes</Link>
          <Link to="/hospitais">Hospitais</Link>
          <Link to="/agenda">Agenda</Link>
          <Link to="/exames">Exames</Link>
          <Link to="/sobre">A clínica</Link>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <small>
          © {new Date().getFullYear()} Atlas Saúde · Cuidado integrado, com
          inteligência diagnóstica.
        </small>
      </footer>
    </div>
  )
}
