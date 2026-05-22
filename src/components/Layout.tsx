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

  // Fecha o menu mobile ao rolar a página, com a animação normal de fechar
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [menuOpen])

  const isDashboard = location.pathname.startsWith('/dashboard')

  return (
    <div className="layout">
      <header className={`header ${isDashboard ? 'header-dark' : ''}`}>
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
      <main className={`main ${isDashboard ? 'main-flush' : ''}`}>
        <Outlet />
      </main>
      <footer className={`footer ${isDashboard ? 'footer-dark' : ''}`}>
        <small>
          © {new Date().getFullYear()} Atlas Saúde · Cuidado integrado, com
          inteligência diagnóstica.
        </small>
      </footer>
    </div>
  )
}
