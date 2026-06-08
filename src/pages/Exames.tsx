import { useCallback, useEffect, useMemo, useState } from 'react'
import { listExams } from '@/services/exam'
import { ApiRequestError } from '@/services/api'
import type { Exam, ExamReportRow, Page } from '@/types'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR')
}

export function Exames() {
  const [exams, setExams] = useState<Page<Exam> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Buscamos uma página ampla para montar o relatório no próprio front.
      const data = await listExams(0, 100)
      setExams(data)
    } catch (err) {
      setExams(null)
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Não foi possível carregar os exames.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Relatório de hemogramas normais derivado da própria lista de exames
  // (isAbnormal = false), em vez de depender de um endpoint de relatório.
  const normalReport = useMemo<ExamReportRow[]>(() => {
    if (!exams) return []
    return exams.content
      .filter((e) => !e.isAbnormal)
      .map((e) => ({
        patient: e.customer?.name ?? `#${e.customer?.id ?? '—'}`,
        testType: e.type,
        orderDate: e.orderDate,
        hemoglobinResult:
          e.examData?.erythrogram?.hemoglobin?.value != null
            ? `${e.examData.erythrogram.hemoglobin.value} ${e.examData.erythrogram.hemoglobin.unit ?? ''}`.trim()
            : '—',
      }))
  }, [exams])

  return (
    <section className="page">
      <h1>Exames realizados</h1>
      <p className="muted">
        Histórico de exames registrados na plataforma, com relatório de hemogramas
        dentro da faixa de referência.
      </p>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      <div className="card">
        <h2>Todos os exames</h2>
        {loading && <p className="muted">Carregando...</p>}
        {!loading && !error && exams && exams.empty && (
          <p className="muted">Nenhum exame realizado ainda.</p>
        )}
        {!loading && !error && exams && !exams.empty && (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Paciente</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.content.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.type}</td>
                  <td>{e.customer?.name ?? `#${e.customer?.id}`}</td>
                  <td>{formatDateTime(e.orderDate)}</td>
                  <td>
                    {e.isAbnormal ? (
                      <span className="pill pill-warn">Alterado</span>
                    ) : (
                      <span className="pill pill-ok">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Relatório de hemogramas normais</h2>
        {loading && <p className="muted">Carregando...</p>}
        {!loading && !error && normalReport.length === 0 && (
          <p className="muted">
            Nenhum hemograma dentro da faixa de referência por enquanto.
          </p>
        )}
        {!loading && !error && normalReport.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Hemoglobina</th>
              </tr>
            </thead>
            <tbody>
              {normalReport.map((row, i) => (
                <tr key={`${row.patient}-${i}`}>
                  <td>{row.patient}</td>
                  <td>{row.testType}</td>
                  <td>{formatDateTime(row.orderDate)}</td>
                  <td>{row.hemoglobinResult}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
