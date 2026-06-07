import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useUser } from '@/hooks/useUser'
import { useHemogram } from '@/hooks/useHemogram'
import { useLatestSchedule } from '@/hooks/useLatestSchedule'
import { temAcessoIA, rotuloClasse } from '@/services/userClass'
import { PriorityBadge } from '@/components/PriorityBadge'
import { GoogleAd } from '@/components/GoogleAd'
import humanoidImg from '@/assets/humanoid.png'
import type { AutoScheduleResponse, HemogramResponseDTO, User } from '@/types'

/* ================================================================== */
/* Helpers                                                             */
/* ================================================================== */

type RefStatus = 'baixo' | 'normal' | 'alto'

function parseRef(ref: string | undefined): [number, number] | null {
  if (!ref) return null
  const m = ref.match(/([\d.]+)\s*[-–]\s*([\d.]+)/)
  if (!m) return null
  return [parseFloat(m[1]), parseFloat(m[2])]
}

function statusOf(value: number, ref: string | undefined): RefStatus {
  const r = parseRef(ref)
  if (!r) return 'normal'
  if (value < r[0]) return 'baixo'
  if (value > r[1]) return 'alto'
  return 'normal'
}

function pctInRange(value: number, ref: string | undefined): number {
  const r = parseRef(ref)
  if (!r) return 68
  const [min, max] = r
  if (max === min) return 100
  return Math.max(6, Math.min(100, ((value - min) / (max - min)) * 100))
}

function formatNumber(v: number, decimals = 1): string {
  return v.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

function generateHistory(seed: number, value: number, count = 12): number[] {
  let s = (seed * 12347 + 31) % 233280
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const out: number[] = []
  let v = value * (0.85 + rand() * 0.1)
  for (let i = 0; i < count - 1; i++) {
    v += (rand() - 0.5) * value * 0.07
    out.push(Math.max(value * 0.55, v))
  }
  out.push(value)
  return out
}

/* paleta sóbria */
const C = {
  gold: '#d8b25f',
  blue: '#5b9bd5',
  green: '#5fb89a',
  red: '#d97a82',
  violet: '#9a8bd0',
}

/* ================================================================== */
/* Tooltip                                                             */
/* ================================================================== */

type TipEntry = { name?: string; value?: number | string; color?: string }

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TipEntry[]
  label?: string | number
}) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rc-tip">
      {label != null && <p className="rc-tip-label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="rc-tip-row">
          <span className="rc-tip-dot" style={{ background: p.color }} />
          <span className="rc-tip-name">{p.name}</span>
          <strong>{typeof p.value === 'number' ? formatNumber(p.value, 1) : p.value}</strong>
        </p>
      ))}
    </div>
  )
}

/* ================================================================== */
/* Router                                                              */
/* ================================================================== */

export function Dashboard() {
  const { user, logout } = useUser()
  const { data: hemograma, loading, error } = useHemogram(user?.customerId)
  const { data: proximaConsulta } = useLatestSchedule(user?.customerId)

  if (!user) return <Navigate to="/cadastro" replace />

  return temAcessoIA(user.userClass) ? (
    <PremiumDashboard
      user={user}
      logout={logout}
      hemograma={hemograma}
      loading={loading}
      error={error}
      proximaConsulta={proximaConsulta}
    />
  ) : (
    <StandardDashboard
      user={user}
      logout={logout}
      hemograma={hemograma}
      loading={loading}
      error={error}
      proximaConsulta={proximaConsulta}
    />
  )
}

type SubProps = {
  user: User
  logout: () => void
  hemograma: HemogramResponseDTO | null
  loading: boolean
  error: string | null
  proximaConsulta: AutoScheduleResponse | null
}

function formatScheduleDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* ================================================================== */
/* Premium                                                             */
/* ================================================================== */

const MESES = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai']

function PremiumDashboard({ user, logout, hemograma, loading, error, proximaConsulta }: SubProps) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const model = useMemo(() => {
    if (!hemograma) return null
    const seed = hemograma.customerId
    const ed = hemograma.examData
    const hb = generateHistory(seed + 1, ed.erythrogram.hemoglobin.value, 12)
    const rbc = generateHistory(seed + 2, ed.erythrogram.rbc.value, 12)
    const wbc = generateHistory(seed + 3, ed.leukogram.wbc_total.value, 12)
    const plt = generateHistory(seed + 4, ed.platelets.count, 12)
    const week = generateHistory(seed + 5, 82, 7)
    return {
      hb,
      rbc,
      wbc,
      plt,
      trend: MESES.map((mes, i) => ({
        mes,
        Hemoglobina: Number(hb[i].toFixed(2)),
        Hemácias: Number(rbc[i].toFixed(2)),
      })),
      week: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((dia, i) => ({
        dia,
        adesao: Math.round(week[i]),
      })),
    }
  }, [hemograma])

  const observation = hemograma?.observation?.trim() || null
  const initials = user.nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  const indicadores = hemograma
    ? [
        {
          label: 'Hemoglobina',
          pct: pctInRange(
            hemograma.examData.erythrogram.hemoglobin.value,
            hemograma.examData.erythrogram.hemoglobin.ref,
          ),
          color: C.red,
        },
        {
          label: 'Hemácias',
          pct: pctInRange(
            hemograma.examData.erythrogram.rbc.value,
            hemograma.examData.erythrogram.rbc.ref,
          ),
          color: C.violet,
        },
        {
          label: 'Leucócitos',
          pct: pctInRange(
            hemograma.examData.leukogram.wbc_total.value,
            hemograma.examData.leukogram.wbc_total.ref,
          ),
          color: C.green,
        },
        {
          label: 'Plaquetas',
          pct: pctInRange(hemograma.examData.platelets.count, '150000-450000'),
          color: C.gold,
        },
      ]
    : []

  const statusHb = hemograma ? statusOf(hemograma.examData.erythrogram.hemoglobin.value, hemograma.examData.erythrogram.hemoglobin.ref) : 'normal'
  const statusRbc = hemograma ? statusOf(hemograma.examData.erythrogram.rbc.value, hemograma.examData.erythrogram.rbc.ref) : 'normal'
  const statusWbc = hemograma ? statusOf(hemograma.examData.leukogram.wbc_total.value, hemograma.examData.leukogram.wbc_total.ref) : 'normal'
  const statusPlt = hemograma ? statusOf(hemograma.examData.platelets.count, '150000-450000') : 'normal'

  return (
    <section className="page dashboard-premium-dark cockpit dash">
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <header className="dash-top">
        <div className="dash-id">
          <div className="dash-avatar" aria-hidden>
            {initials}
          </div>
          <div>
            <span className="dash-eyebrow">Atlas {rotuloClasse(user.userClass)} · Painel clínico</span>
            <h1>{user.nome}</h1>
            <p className="dash-sub">
              <span className="dash-live-dot" aria-hidden="true" />
              Sincronizado às{' '}
              {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="dash-top-actions">
          <PriorityBadge userClass={user.userClass} />
          <button type="button" className="btn-ghost-dark" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      {loading && (
        <div className="panel">
          <p className="muted">Carregando painel…</p>
        </div>
      )}
      {error && !loading && (
        <div className="panel">
          <p role="alert" className="form-error">
            {error}
          </p>
        </div>
      )}

      {hemograma && model && !loading && !error && (
        <>
          {/* Cockpit Grid de 3 Colunas */}
          <div className="cockpit-grid">
            {/* Coluna 1: Esquerda */}
            <div className="cockpit-col">
              <section className="panel">
                <header className="panel-head">
                  <div>
                    <h2>Evolução clínica</h2>
                    <p className="panel-sub">Hemoglobina e hemácias · 12 meses</p>
                  </div>
                </header>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={210}>
                    <AreaChart data={model.trend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                      <defs>
                        <linearGradient id="gradHb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={C.red} stopOpacity={0.28} />
                          <stop offset="100%" stopColor={C.red} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradRbc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={C.violet} stopOpacity={0.28} />
                          <stop offset="100%" stopColor={C.violet} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis
                        dataKey="mes"
                        tick={{ fill: '#8a8c95', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        dy={6}
                      />
                      <YAxis
                        tick={{ fill: '#8a8c95', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={36}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
                      <Area
                        type="monotone"
                        dataKey="Hemoglobina"
                        stroke={C.red}
                        strokeWidth={2}
                        fill="url(#gradHb)"
                        animationDuration={1100}
                      />
                      <Area
                        type="monotone"
                        dataKey="Hemácias"
                        stroke={C.violet}
                        strokeWidth={2}
                        fill="url(#gradRbc)"
                        animationDuration={1100}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend" style={{ marginTop: '0.5rem' }}>
                  <span>
                    <i style={{ background: C.red }} /> Hemoglobina
                  </span>
                  <span>
                    <i style={{ background: C.violet }} /> Hemácias
                  </span>
                </div>
              </section>

              <section className="panel">
                <header className="panel-head">
                  <div>
                    <h2>Índices de referência</h2>
                    <p className="panel-sub">Posição na faixa clínica</p>
                  </div>
                </header>
                <ul className="ind-list">
                  {indicadores.map((ind) => (
                    <li key={ind.label}>
                      <div className="ind-row">
                        <span>{ind.label}</span>
                        <strong>{Math.round(ind.pct)}%</strong>
                      </div>
                      <div className="ind-bar">
                        <div
                          className="ind-bar-fill"
                          style={{ width: `${ind.pct}%`, background: ind.color }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="ind-score">
                  <span>Score clínico geral</span>
                  <strong>A+</strong>
                </div>
              </section>
            </div>

            {/* Coluna 2: Centro (Scanner Biométrico) */}
            <div className="cockpit-center">
              <div className="cockpit-center-head">
                <span className="panel-badge">BIOMETRIA ATIVA</span>
                <h2>Scanner Holográfico</h2>
              </div>

              <div className="body-zoom-wrap">
                {/* Palco do Corpo */}
                <div className="body-stage">
                  <div className="body-ring body-ring-1" />
                  <div className="body-ring body-ring-2" />
                  <div className="body-scanline" />

                  {/* Humanoide holográfico — escaneamento biométrico */}
                  <img
                    className="body-svg"
                    src={humanoidImg}
                    alt="Escaneamento biométrico do corpo"
                    draggable={false}
                  />

                  {/* Hotspot 1: Pescoço/Linfonodos - Leucócitos */}
                  <div className={`vital-marker vital-status-${statusWbc}`} style={{ top: '17%', left: '52%' }}>
                    <div className="vital-pin">
                      <div className="vital-pin-core" />
                      <div className="vital-pin-pulse" />
                    </div>
                    <div className="vital-connector" style={{ background: `linear-gradient(90deg, ${C.green}, rgba(255,255,255,0.02))` }} />
                    <div className="vital-card">
                      <small>Sistema Imune</small>
                      <strong>{formatNumber(hemograma.examData.leukogram.wbc_total.value, 0)} {hemograma.examData.leukogram.wbc_total.unit}</strong>
                    </div>
                  </div>

                  {/* Hotspot 2: Tórax/Coração - Hemoglobina */}
                  <div className={`vital-marker vital-marker-left vital-status-${statusHb}`} style={{ top: '31%', left: '48%' }}>
                    <div className="vital-card">
                      <small>Cardiopulmonar</small>
                      <strong>{formatNumber(hemograma.examData.erythrogram.hemoglobin.value, 1)} {hemograma.examData.erythrogram.hemoglobin.unit}</strong>
                    </div>
                    <div className="vital-connector" style={{ background: `linear-gradient(270deg, ${C.red}, rgba(255,255,255,0.02))` }} />
                    <div className="vital-pin">
                      <div className="vital-pin-core" />
                      <div className="vital-pin-pulse" />
                    </div>
                  </div>

                  {/* Hotspot 3: Abdômen/Circulação - Hemácias */}
                  <div className={`vital-marker vital-status-${statusRbc}`} style={{ top: '46%', left: '52%' }}>
                    <div className="vital-pin">
                      <div className="vital-pin-core" />
                      <div className="vital-pin-pulse" />
                    </div>
                    <div className="vital-connector" style={{ background: `linear-gradient(90deg, ${C.violet}, rgba(255,255,255,0.02))` }} />
                    <div className="vital-card">
                      <small>Circulação Geral</small>
                      <strong>{formatNumber(hemograma.examData.erythrogram.rbc.value, 2)} {hemograma.examData.erythrogram.rbc.unit}</strong>
                    </div>
                  </div>

                  {/* Hotspot 4: Medula Óssea/Plaquetas */}
                  <div className={`vital-marker vital-marker-left vital-status-${statusPlt}`} style={{ top: '60%', left: '48%' }}>
                    <div className="vital-card">
                      <small>Medula Óssea</small>
                      <strong>{formatNumber(hemograma.examData.platelets.count, 0)} /µL</strong>
                    </div>
                    <div className="vital-connector" style={{ background: `linear-gradient(270deg, ${C.gold}, rgba(255,255,255,0.02))` }} />
                    <div className="vital-pin">
                      <div className="vital-pin-core" />
                      <div className="vital-pin-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 3: Direita */}
            <div className="cockpit-col">
              <section className="panel panel-ai ai-side-card">
                <header className="panel-head" style={{ marginBottom: '0.85rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.08rem' }}>Laudo inteligente</h2>
                    <p className="panel-sub" style={{ fontSize: '0.76rem' }}>Gerado pela Atlas IA · Groq</p>
                  </div>
                  <span className="panel-badge" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
                    97% confiança
                  </span>
                </header>
                {observation ? (
                  <div className="ai-side-body">
                    <div className="ai-text" style={{ fontSize: '0.86rem', lineHeight: '1.45', color: '#cbd5e1' }}>
                      {observation}
                    </div>
                  </div>
                ) : (
                  <p className="muted" style={{ fontSize: '0.86rem' }}>Laudo sendo gerado…</p>
                )}
                {proximaConsulta && (
                  <p
                    className="muted"
                    style={{ fontSize: '0.78rem', marginTop: '0.55rem' }}
                  >
                    Consulta prioritária agendada em{' '}
                    <strong>{proximaConsulta.hospitalName}</strong> · {formatScheduleDate(proximaConsulta.scheduledAt)}
                  </p>
                )}
                <button type="button" className="btn-gold ai-side-btn" style={{ padding: '0.65rem 1.2rem', fontSize: '0.86rem' }}>
                  {proximaConsulta ? 'Ver detalhes da consulta' : 'Agendar consulta prioritária'}
                </button>
              </section>

              <section className="panel">
                <header className="panel-head">
                  <div>
                    <h2>Adesão semanal</h2>
                    <p className="panel-sub">Engajamento ao plano</p>
                  </div>
                </header>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={170}>
                    <BarChart data={model.week} margin={{ top: 8, right: 4, bottom: 0, left: -22 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis
                        dataKey="dia"
                        tick={{ fill: '#8a8c95', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        dy={6}
                      />
                      <YAxis
                        tick={{ fill: '#8a8c95', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      />
                      <Bar dataKey="adesao" radius={[5, 5, 0, 0]} animationDuration={900}>
                        {model.week.map((d, i) => {
                          const max = Math.max(...model.week.map((w) => w.adesao))
                          return (
                            <Cell key={i} fill={d.adesao === max ? C.gold : 'rgba(216,178,95,0.35)'} />
                          )
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

/* ================================================================== */
/* Standard                                                            */
/* ================================================================== */

function LockedCard({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="locked-card">
      <div className="locked-overlay">
        <div className="locked-icon" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3>{title}</h3>
        <p>{hint}</p>
        <button type="button" className="btn-secondary btn-sm">
          Conhecer Atlas Premium
        </button>
      </div>
      <div className="locked-bg" aria-hidden>
        <div className="locked-skeleton" />
        <div className="locked-skeleton" />
        <div className="locked-skeleton short" />
      </div>
    </div>
  )
}

function StandardDashboard({ user, logout, hemograma, loading, error, proximaConsulta }: SubProps) {
  return (
    <section className="page dashboard theme-base dashboard-standard dashboard-standard-wide">
      <div className="standard-shell">
        <header className="dashboard-header">
          <div>
            <p className="muted">Plano Atlas {rotuloClasse(user.userClass)}</p>
            <h1>Olá, {user.nome.split(' ')[0]}</h1>
            <p className="muted">Carteirinha #{user.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="dashboard-actions">
            <PriorityBadge userClass={user.userClass} />
            <button type="button" className="btn-secondary" onClick={logout} aria-label="Sair">
              Sair
            </button>
          </div>
        </header>

        <div className="standard-banner">
          <strong>Fila padrão · 14 a 28 dias para próxima consulta</strong>
          <span className="muted">
            Atendimento garantido. Gráficos e análise por IA ficam disponíveis no plano Premium.
          </span>
        </div>

        {/* Banner publicitário no topo (full-width) */}
        <GoogleAd
          slot="1111111111"
          format="horizontal"
          label="Anúncio · patrocinado pelo Google"
          className="ad-slot-banner"
        />

        <div className="standard-grid">
          <div className="standard-main">
            {loading && <p className="muted">Carregando resultado...</p>}
            {error && !loading && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}

            {hemograma && !loading && !error && (
              <div className="card card-base">
                <h2>Resultado do hemograma</h2>
                <p className="muted">Exame #{hemograma.examId}</p>
                <dl className="exame-grid exame-grid-basic">
                  <div>
                    <dt>Hemoglobina</dt>
                    <dd>
                      {formatNumber(hemograma.examData.erythrogram.hemoglobin.value, 2)}{' '}
                      {hemograma.examData.erythrogram.hemoglobin.unit}
                    </dd>
                  </div>
                  <div>
                    <dt>Hemácias (RBC)</dt>
                    <dd>
                      {formatNumber(hemograma.examData.erythrogram.rbc.value, 2)}{' '}
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
                <p className="muted standard-disclaimer">
                  Resultado emitido sem laudo automatizado. A interpretação clínica será feita pelo médico
                  no momento da consulta.
                </p>
              </div>
            )}

            {/* Anúncio in-feed entre o resultado e os blocos bloqueados */}
            <GoogleAd
              slot="2222222222"
              format="fluid"
              label="Anúncio"
              className="ad-slot-infeed"
            />

            <LockedCard
              title="Gráficos de evolução clínica"
              hint="Acompanhe a tendência dos seus exames ao longo do tempo no plano Premium."
            />
            <LockedCard
              title="Laudo por inteligência artificial"
              hint="Avaliação imediata do hemograma gerada pela Atlas IA está disponível no plano Premium."
            />

            <div className="card card-base">
              <h2>Próxima consulta</h2>
              {proximaConsulta ? (
                <>
                  <p>
                    <strong>{proximaConsulta.hospitalName}</strong>
                    {proximaConsulta.hospitalType ? ` · ${proximaConsulta.hospitalType}` : ''}
                  </p>
                  <p className="muted">
                    Agendada para <strong>{formatScheduleDate(proximaConsulta.scheduledAt)}</strong>
                  </p>
                  <button type="button" className="btn-secondary">
                    Confirmar presença
                  </button>
                </>
              ) : (
                <>
                  <p>
                    Sua solicitação foi registrada na agenda padrão. Previsão atual de atendimento:{' '}
                    <strong>14 a 28 dias</strong>.
                  </p>
                  <button type="button" className="btn-secondary">
                    Confirmar fila padrão
                  </button>
                </>
              )}
            </div>
          </div>

          <aside className="standard-sidebar">
            <GoogleAd
              slot="3333333333"
              format="vertical"
              label="Anúncio"
              className="ad-slot-rail"
            />
            <GoogleAd
              slot="4444444444"
              format="rectangle"
              label="Anúncio"
              className="ad-slot-rail"
            />
          </aside>
        </div>
      </div>
    </section>
  )
}
