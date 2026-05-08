import { Link } from 'react-router-dom'
import { HeartPulse, Sparkles, Lock, Calendar } from 'lucide-react'

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
              d="M0 30 L60 30 L75 30 L85 10 L95 50 L110 30 L150 30 L165 30 L175 18 L185 42 L200 30 L260 30 L320 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
          <div className="hero-card-locked">
            <Lock size={13} strokeWidth={2.2} />
            Laudo por IA · disponível no Premium
          </div>
        </div>
      </aside>
    </section>
  )
}
