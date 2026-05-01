import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="brand">
          Frontend
        </Link>
        <nav className="nav">
          <Link to="/">Início</Link>
          <Link to="/sobre">Sobre</Link>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <small>© {new Date().getFullYear()} — Projeto Frontend</small>
      </footer>
    </div>
  )
}
