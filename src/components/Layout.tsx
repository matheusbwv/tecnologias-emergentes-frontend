import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Fecha o menu sempre que a rota muda
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Previne scroll do body quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

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

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? 'nav-toggle-open' : ''}`}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" aria-hidden />
          <span className="nav-toggle-bar" aria-hidden />
          <span className="nav-toggle-bar" aria-hidden />
        </button>

        <nav id="primary-nav" className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/">Início</Link>
          <Link to="/dashboard">Meu plano</Link>
          <Link to="/pacientes">Pacientes</Link>
          <Link to="/hospitais">Hospitais</Link>
          <Link to="/agenda">Agenda</Link>
          <Link to="/exames">Exames</Link>
          <Link to="/sobre">A clínica</Link>
        </nav>

        {menuOpen && (
          <button
            type="button"
            className="nav-backdrop"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          />
        )}
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
