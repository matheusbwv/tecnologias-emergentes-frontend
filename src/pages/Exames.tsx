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
  const [examsError, setExamsError] = useState<string | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setExamsError(null)
    setReportError(null)

    // allSettled: uma seção que falha não derruba a outra.
    const [examsResult, reportResult] = await Promise.allSettled([
      listExams(0, 15),
      getNormalExamsReport(0, 15),
    ])

    if (examsResult.status === 'fulfilled') {
      setExams(examsResult.value)
    } else {
      setExams(null)
      setExamsError(
        examsResult.reason instanceof ApiRequestError
          ? examsResult.reason.message
          : 'Não foi possível carregar os exames.',
      )
    }

    if (reportResult.status === 'fulfilled') {
      setReport(reportResult.value)
    } else {
      // O relatório é secundário: se estiver indisponível, mostramos um aviso
      // discreto em vez de quebrar a página.
      setReport(null)
      setReportError('Relatório indisponível no momento.')
    }

    setLoading(false)
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

      <div className="card">
        <h2>Todos os exames</h2>
        {loading && <p className="muted">Carregando...</p>}
        {!loading && examsError && (
          <p role="alert" className="form-error">
            {examsError}
          </p>
        )}
        {!loading && !examsError && exams && exams.empty && (
          <p className="muted">Nenhum exame realizado ainda.</p>
        )}
        {!loading && !examsError && exams && !exams.empty && (
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
        {!loading && reportError && <p className="muted">{reportError}</p>}
        {!loading && !reportError && report && report.empty && (
          <p className="muted">
            Nenhum hemograma dentro da faixa de referência por enquanto.
          </p>
        )}
        {!loading && !reportError && report && !report.empty && (
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
