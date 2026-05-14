import { Link } from 'react-router-dom'
import { HeartPulse, Sparkles, Calendar } from 'lucide-react'

export function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-kicker">
          <HeartPulse size={14} className="hero-kicker-icon" aria-hidden />
          Atlas Saúde · Atendimento 24h
        </span>

        <h1 className="hero-title">
          O <em>cuidado certo</em>,
          <br />
          no <em>tempo exato</em>.
        </h1>

        <p className="hero-lead">
          Rede integrada com diagnóstico assistido por inteligência artificial,
          agendamento prioritário em hospitais parceiros e um time clínico
          dedicado ao seu acompanhamento contínuo.
        </p>

        <p className="muted hero-sub">
          Faça sua adesão em poucos minutos e receba imediatamente seu cartão
          digital, histórico unificado de exames e acesso ao concierge médico.
        </p>

        <div className="cta-row">
          <Link to="/cadastro" className="btn-link btn-cta-primary">
            Quero ser paciente
          </Link>
          <Link to="/sobre" className="btn-link-ghost">
            Conhecer a clínica
          </Link>
        </div>

        <ul className="hero-stats" aria-label="Indicadores da clínica">
          <li>
            <strong>+18</strong>
            <span>anos de cuidado</span>
          </li>
          <li>
            <strong>98%</strong>
            <span>satisfação dos pacientes</span>
          </li>
          <li>
            <strong>4 min</strong>
            <span>tempo médio de laudo</span>
          </li>
        </ul>
      </div>

      <aside className="hero-visual" aria-hidden>
        <div className="hero-card hero-card-vip">
          <div className="hero-card-head">
            <span className="hero-card-tag tag-vip">
              <Sparkles size={10} strokeWidth={2.5} />
              PLANO PREMIUM
            </span>
            <span className="hero-card-pulse-dot" />
          </div>
          <div className="hero-card-title">Laudo de hemograma · IA</div>
          <div className="hero-card-line w90" />
          <div className="hero-card-line w70" />
          <div className="hero-card-line w55" />
          <svg
            className="hero-ecg"
            viewBox="0 0 320 60"
            preserveAspectRatio="none"
          >
            <path
              d="M0 30 C15 14 25 14 40 30 C55 46 65 46 80 30 C95 14 105 14 120 30 C135 46 145 46 160 30 C175 14 185 14 200 30 C215 46 225 46 240 30 C255 14 265 14 280 30 C295 46 305 46 320 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M40 18 L40 42 M80 18 L80 42 M120 18 L120 42 M160 18 L160 42 M200 18 L200 42 M240 18 L240 42 M280 18 L280 42"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
          <div className="hero-card-cta">
            <Calendar size={12} strokeWidth={2.4} />
            Agendar consulta · 1 toque →
          </div>
        </div>

        <div className="hero-card hero-card-base">
          <div className="hero-card-head">
            <span className="hero-card-tag tag-base">PLANO ESSENCIAL</span>
            <span className="hero-card-protocol">PROT. 0042</span>
          </div>
          <div className="hero-card-title base">Resultado de exame</div>
          <div className="hero-card-line w80 base" />
          <div className="hero-card-line w50 base" />
          <div className="hero-card-line w60 base" />
        </div>
      </aside>
    </section>
  )
}
