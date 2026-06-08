import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'
import { createSchedule, listSchedules } from '@/services/schedule'
import { listCustomers } from '@/services/customer'
import { listHospitals } from '@/services/hospital'
import { ApiRequestError } from '@/services/api'
import type {
  Customer,
  Hospital,
  Page,
  Schedule,
  ScheduleReportRow,
} from '@/types'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR')
}

export function Agenda() {
  const [schedules, setSchedules] = useState<Page<Schedule> | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [schedulesError, setSchedulesError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [serviceCode, setServiceCode] = useState('1001')
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [hospitalId, setHospitalId] = useState<number | null>(null)
  const [scheduledAt, setScheduledAt] = useState('')

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSchedulesError(null)

    // allSettled: cada bloco da tela carrega de forma independente. Assim, uma
    // lista que falhe não impede ver as outras nem usar o formulário.
    const [schedulesResult, customersResult, hospitalsResult] =
      await Promise.allSettled([
        listSchedules(0, 100),
        listCustomers(0, 50),
        listHospitals(0, 50),
      ])

    if (schedulesResult.status === 'fulfilled') {
      setSchedules(schedulesResult.value)
    } else {
      setSchedules(null)
      setSchedulesError(
        schedulesResult.reason instanceof ApiRequestError
          ? schedulesResult.reason.message
          : 'Não foi possível carregar os agendamentos.',
      )
    }

    if (customersResult.status === 'fulfilled') {
      setCustomers(customersResult.value.content)
      if (!customerId && customersResult.value.content[0]) {
        setCustomerId(customersResult.value.content[0].id)
      }
    }

    if (hospitalsResult.status === 'fulfilled') {
      setHospitals(hospitalsResult.value.content)
      if (!hospitalId && hospitalsResult.value.content[0]) {
        setHospitalId(hospitalsResult.value.content[0].id)
      }
    }

    setLoading(false)
  }, [customerId, hospitalId])

  // Relatório unificado derivado da própria lista de agendamentos (ordenado por
  // data desc), em vez de depender de um endpoint de relatório.
  const report = useMemo<ScheduleReportRow[]>(() => {
    if (!schedules) return []
    return [...schedules.content]
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
      )
      .map((s) => ({
        scheduledAt: s.scheduledAt,
        patient: s.customer?.name ?? `#${s.customer?.id ?? '—'}`,
        hospital: s.hospital?.categoryName ?? `#${s.hospital?.id ?? '—'}`,
      }))
  }, [schedules])

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (customerId == null || hospitalId == null || !scheduledAt) {
      setError('Preencha paciente, hospital e horário.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const isoWithOffset = new Date(scheduledAt).toISOString()
      await createSchedule({
        serviceCode: Number.parseInt(serviceCode, 10) || 0,
        hospitalId,
        customerId,
        scheduledAt: isoWithOffset,
      })
      setScheduledAt('')
      await loadAll()
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Falha ao agendar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <h1>Agenda de atendimentos</h1>
      <p className="muted">
        Programe consultas e exames vinculando pacientes às unidades parceiras.
      </p>

      <div className="card">
        <h2>Novo agendamento</h2>
        {customers.length === 0 || hospitals.length === 0 ? (
          <p className="muted">
            É preciso ter ao menos um paciente e um hospital cadastrados para agendar.
          </p>
        ) : (
          <form className="form form-inline" onSubmit={handleCreate}>
            <label className="field">
              <span>Código do serviço</span>
              <input
                type="number"
                required
                value={serviceCode}
                onChange={(e) => setServiceCode(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Paciente</span>
              <select
                value={customerId ?? ''}
                onChange={(e) => setCustomerId(Number.parseInt(e.target.value, 10))}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.id} — {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Hospital</span>
              <select
                value={hospitalId ?? ''}
                onChange={(e) => setHospitalId(Number.parseInt(e.target.value, 10))}
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    #{h.id} — {h.categoryName}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Data e hora</span>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Agendando...' : 'Confirmar agendamento'}
            </button>
          </form>
        )}
      </div>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      <div className="card">
        <h2>Agendamentos registrados</h2>
        {loading && <p className="muted">Carregando...</p>}
        {!loading && schedulesError && (
          <p role="alert" className="form-error">
            {schedulesError}
          </p>
        )}
        {!loading && !schedulesError && schedules && schedules.empty && (
          <p className="muted">
            Nenhum agendamento registrado ainda. Use o formulário acima para vincular
            um paciente a um hospital.
          </p>
        )}
        {!loading && !schedulesError && schedules && !schedules.empty && (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Serviço</th>
                <th>Paciente</th>
                <th>Hospital</th>
                <th>Quando</th>
              </tr>
            </thead>
            <tbody>
              {schedules.content.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.serviceCode}</td>
                  <td>{s.customer?.name ?? `#${s.customer?.id}`}</td>
                  <td>{s.hospital?.categoryName ?? `#${s.hospital?.id}`}</td>
                  <td>{formatDateTime(s.scheduledAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Relatório unificado (ordenado por data)</h2>
        {loading && <p className="muted">Carregando...</p>}
        {!loading && report.length === 0 && (
          <p className="muted">Nenhum agendamento para exibir no relatório.</p>
        )}
        {!loading && report.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Quando</th>
                <th>Paciente</th>
                <th>Hospital</th>
              </tr>
            </thead>
            <tbody>
              {report.map((row, i) => (
                <tr key={`${row.scheduledAt}-${i}`}>
                  <td>{formatDateTime(row.scheduledAt)}</td>
                  <td>{row.patient}</td>
                  <td>{row.hospital}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
