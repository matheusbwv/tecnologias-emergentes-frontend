import { Navigate } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import { temAcessoIA, rotuloClasse } from '@/services/userClass'
import { PriorityBadge } from '@/components/PriorityBadge'
import type { Hemograma } from '@/types'

const hemogramaMock: Hemograma = {
  hemoglobina: 12.5,
  leucocitos: 6500,
  hematocrito: 38,
  plaquetas: 220000,
  timestamp: new Date().toISOString(),
}

const diagnosticoMock = {
  resumo:
    'Hemograma compatível com leve anemia ferropriva. Indícios de fadiga sistêmica.',
  alertas: ['Hemoglobina abaixo da referência (13.5 g/dL)'],
  recomendacao:
    'Solicitar consulta com clínico geral em até 7 dias e avaliar reposição de ferro.',
}

export function Dashboard() {
  const { user, logout } = useUser()

  if (!user) return <Navigate to="/cadastro" replace />

  const vip = temAcessoIA(user.userClass)
  const tema = vip ? 'theme-vip' : 'theme-base'

  return (
    <section className={`page dashboard ${tema}`}>
      <header className="dashboard-header">
        <div>
          <h1>Olá, {user.nome.split(' ')[0]}</h1>
          <p className="muted">
            Plano <strong>Atlas {rotuloClasse(user.userClass)}</strong> ·
            Carteirinha #{user.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div className="dashboard-actions">
          <PriorityBadge userClass={user.userClass} />
          <button
            type="button"
            className="btn-secondary"
            onClick={logout}
            aria-label="Sair"
          >
            Sair
          </button>
        </div>
      </header>

      <div className={`card ${vip ? 'card-vip' : 'card-base'}`}>
        <h2>Resultado de hemograma</h2>
        <p className="muted">
          Coletado em{' '}
          {new Date(hemogramaMock.timestamp).toLocaleString('pt-BR')}
        </p>

        <dl className="exame-grid">
          <div>
            <dt>Hemoglobina</dt>
            <dd>{hemogramaMock.hemoglobina} g/dL</dd>
          </div>
          <div>
            <dt>Leucócitos</dt>
            <dd>{hemogramaMock.leucocitos.toLocaleString('pt-BR')} /mm³</dd>
          </div>
          <div>
            <dt>Hematócrito</dt>
            <dd>{hemogramaMock.hematocrito}%</dd>
          </div>
          <div>
            <dt>Plaquetas</dt>
            <dd>{hemogramaMock.plaquetas.toLocaleString('pt-BR')} /mm³</dd>
          </div>
        </dl>
      </div>

      {vip && (
        <div className="card card-vip card-vip-hero">
          <h2>Laudo com inteligência diagnóstica</h2>
          <p>
            <strong>{diagnosticoMock.resumo}</strong>
          </p>
          <ul className="alerta-lista">
            {diagnosticoMock.alertas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p>
            <em>Recomendação:</em> {diagnosticoMock.recomendacao}
          </p>
          <button type="button" className="btn-vip">
            Agendar consulta prioritária
          </button>
        </div>
      )}

      {!vip && (
        <div className="card card-base">
          <h2>Próxima consulta</h2>
          <p>
            Sua solicitação foi registrada na agenda padrão. Previsão atual de
            atendimento: <strong>14 a 28 dias</strong>.
          </p>
          <button type="button" className="btn-secondary">
            Confirmar fila padrão
          </button>
        </div>
      )}
    </section>
  )
}
