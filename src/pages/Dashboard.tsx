import { Navigate } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import { useHemogram } from '@/hooks/useHemogram'
import { temAcessoIA, rotuloClasse } from '@/services/userClass'
import { PriorityBadge } from '@/components/PriorityBadge'

function formatNumber(value: number) {
  return value.toLocaleString('pt-BR')
}

export function Dashboard() {
  const { user, logout } = useUser()
  const { data: hemograma, loading, error } = useHemogram(user?.customerId)

  if (!user) return <Navigate to="/cadastro" replace />

  const vip = temAcessoIA(user.userClass)
  const tema = vip ? 'theme-vip' : 'theme-base'
  const observation = hemograma?.observation?.trim() || null

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

        {loading && <p className="muted">Carregando exame mais recente...</p>}
        {error && !loading && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}

        {hemograma && !loading && !error && (
          <>
            <p className="muted">Exame #{hemograma.examId} · paciente {hemograma.customerId}</p>
            <dl className="exame-grid">
              <div>
                <dt>Hemoglobina</dt>
                <dd>
                  {hemograma.examData.erythrogram.hemoglobin.value}{' '}
                  {hemograma.examData.erythrogram.hemoglobin.unit}
                </dd>
              </div>
              <div>
                <dt>Hemácias (RBC)</dt>
                <dd>
                  {hemograma.examData.erythrogram.rbc.value}{' '}
                  {hemograma.examData.erythrogram.rbc.unit}
                </dd>
              </div>
              <div>
                <dt>Leucócitos</dt>
                <dd>
                  {formatNumber(hemograma.examData.leukogram.wbc_total.value)}{' '}
                  {hemograma.examData.leukogram.wbc_total.unit}
                </dd>
              </div>
              <div>
                <dt>Plaquetas</dt>
                <dd>{formatNumber(hemograma.examData.platelets.count)} /µL</dd>
              </div>
            </dl>
          </>
        )}
      </div>

      {vip && (
        <div className="card card-vip card-vip-hero">
          <h2>Laudo com inteligência diagnóstica</h2>
          {loading && <p className="muted">Aguardando análise da IA...</p>}
          {!loading && observation && (
            <p className="laudo-ia" style={{ whiteSpace: 'pre-line' }}>
              {observation}
            </p>
          )}
          {!loading && !observation && !error && (
            <p className="muted">
              O laudo automatizado ainda não está disponível para este exame.
            </p>
          )}
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
