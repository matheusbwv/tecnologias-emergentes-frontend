import { Link } from 'react-router-dom'

export function Home() {
  return (
    <section className="page">
      <h1>Plano de Saúde Especulativo</h1>
      <p>
        Um experimento crítico sobre <strong>estratificação algorítmica</strong>
        : como o capital econômico decide a velocidade do diagnóstico e a
        eficiência do cuidado preventivo.
      </p>
      <p className="muted">
        Faça o cadastro para descobrir, com base em sua profissão, renda e CEP,
        a qual classe o sistema te atribui — e quais ferramentas de IA serão
        liberadas (ou bloqueadas) pra você.
      </p>
      <div className="cta-row">
        <Link to="/cadastro" className="btn-link">
          Começar cadastro
        </Link>
        <Link to="/sobre" className="btn-link-ghost">
          Saber mais
        </Link>
      </div>
    </section>
  )
}
