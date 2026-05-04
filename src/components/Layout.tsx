import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="brand">
          Saúde IA
        </Link>
        <nav className="nav">
          <Link to="/">Início</Link>
          <Link to="/dashboard">Meu plano</Link>
          <Link to="/sobre">Sobre o projeto</Link>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <small>
          © {new Date().getFullYear()} — Plano de Saúde Especulativo (MVP)
        </small>
      </footer>
    </div>
  )
}
