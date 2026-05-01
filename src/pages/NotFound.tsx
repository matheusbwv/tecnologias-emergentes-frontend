import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="page">
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar para o início</Link>
    </section>
  )
}
