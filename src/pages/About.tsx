import { Brain, Hospital, UserRoundCheck, ShieldCheck, Check, Minus } from 'lucide-react'

export function About() {
  return (
    <section className="page">
      <h1>A clínica</h1>

      <p>
        A Atlas Saúde é uma clínica integrada de diagnóstico, prevenção e
        acompanhamento clínico contínuo. Combinamos um corpo médico
        multidisciplinar a uma plataforma proprietária de inteligência
        diagnóstica, oferecendo cuidado mais rápido, mais preciso e
        verdadeiramente personalizado.
      </p>

      <figure className="about-banner" aria-hidden>
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80"
          alt=""
          loading="lazy"
        />
        <figcaption>
          <span className="about-banner-tag">UNIDADE PAULISTA</span>
          <span className="about-banner-text">
            Centro clínico integrado · São Paulo
          </span>
        </figcaption>
      </figure>

      <h2>Nossos pilares</h2>
      <div className="about-grid">
        <article className="about-feature">
          <span className="about-feature-icon" aria-hidden>
            <Brain size={20} strokeWidth={2} />
          </span>
          <h3>Diagnóstico assistido por IA</h3>
          <p>
            Nosso motor proprietário interpreta exames laboratoriais em poucos
            minutos, cruzando milhões de referências clínicas para apoiar o
            médico na decisão.
          </p>
        </article>
        <article className="about-feature">
          <span className="about-feature-icon" aria-hidden>
            <Hospital size={20} strokeWidth={2} />
          </span>
          <h3>Rede hospitalar integrada</h3>
          <p>
            Parceria ativa com centros de referência em São Paulo, Rio de
            Janeiro e Belo Horizonte, garantindo agendamento ágil em
            especialidades e exames de imagem.
          </p>
        </article>
        <article className="about-feature">
          <span className="about-feature-icon" aria-hidden>
            <UserRoundCheck size={20} strokeWidth={2} />
          </span>
          <h3>Concierge clínico</h3>
          <p>
            Um profissional de saúde acompanha cada paciente do plano Premium
            individualmente, organizando exames, retornos e segunda opinião.
          </p>
        </article>
        <article className="about-feature">
          <span className="about-feature-icon" aria-hidden>
            <ShieldCheck size={20} strokeWidth={2} />
          </span>
          <h3>Prevenção contínua</h3>
          <p>
            Programas estruturados de prevenção cardiovascular, oncológica e
            metabólica, com check‑ups recorrentes e relatórios de evolução.
          </p>
        </article>
      </div>

      <h2>Planos de adesão</h2>
      <div className="plan-grid">
        <article className="plan-card premium">
          <span className="plan-tag">PLANO PREMIUM</span>
          <h3>Atlas Premium</h3>
          <ul>
            <li>
              <Check size={16} className="plan-icon" aria-hidden />
              Laudos com inteligência diagnóstica em minutos
            </li>
            <li>
              <Check size={16} className="plan-icon" aria-hidden />
              Agendamento prioritário na rede parceira
            </li>
            <li>
              <Check size={16} className="plan-icon" aria-hidden />
              Concierge clínico dedicado · 24/7
            </li>
            <li>
              <Check size={16} className="plan-icon" aria-hidden />
              Telemedicina sob demanda, sem agendamento
            </li>
            <li>
              <Check size={16} className="plan-icon" aria-hidden />
              Histórico unificado e relatórios preventivos
            </li>
          </ul>
        </article>
        <article className="plan-card essencial">
          <span className="plan-tag">PLANO ESSENCIAL</span>
          <h3>Atlas Essencial</h3>
          <ul>
            <li>
              <Check size={16} className="plan-icon" aria-hidden />
              Resultados de exames pelo portal do paciente
            </li>
            <li>
              <Check size={16} className="plan-icon" aria-hidden />
              Agendamento padrão por ordem de chegada
            </li>
            <li>
              <Check size={16} className="plan-icon" aria-hidden />
              Atendimento clínico geral em horário comercial
            </li>
            <li className="dim">
              <Minus size={16} className="plan-icon" aria-hidden />
              Laudo por IA — disponível no Premium
            </li>
            <li className="dim">
              <Minus size={16} className="plan-icon" aria-hidden />
              Concierge clínico — disponível no Premium
            </li>
          </ul>
        </article>
      </div>

      <h2>Compromisso clínico</h2>
      <p>
        Cada decisão de cuidado é revisada por um médico responsável. A
        inteligência diagnóstica é uma ferramenta de apoio: amplia a precisão e
        a velocidade da equipe, sem substituir a relação humana entre o
        profissional e o paciente.
      </p>
    </section>
  )
}
