import { useCallback, useEffect, useState } from 'react'
import { getNormalExamsReport, listExams } from '@/services/exam'
import { ApiRequestError } from '@/services/api'
import type { Exam, ExamReportRow, Page } from '@/types'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR')
}

export function Exames() {
  const [exams, setExams] = useState<Page<Exam> | null>(null)
  const [report, setReport] = useState<Page<ExamReportRow> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [examsData, reportData] = await Promise.all([
        listExams(0, 15),
        getNormalExamsReport(0, 15),
      ])
      setExams(examsData)
      setReport(reportData)
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Erro ao carregar exames.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

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
        {exams && !loading && exams.empty && <p className="muted">Sem exames.</p>}
        {exams && !loading && !exams.empty && (
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
        {report && report.empty && <p className="muted">Sem dados no relatório.</p>}
        {report && !report.empty && (
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
              {report.content.map((row, i) => (
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
