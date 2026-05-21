import { useCallback, useEffect, useState } from 'react'
import { deleteCustomer, listCustomers } from '@/services/customer'
import { ApiRequestError } from '@/services/api'
import type { Customer, Page } from '@/types'

export function Pacientes() {
  const [page, setPage] = useState<Page<Customer> | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const load = useCallback(async (index: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listCustomers(index, 10)
      setPage(data)
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Erro ao carregar pacientes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(pageIndex)
  }, [load, pageIndex])

  async function handleDelete(id: number) {
    if (!confirm(`Remover o paciente #${id}? Essa ação não pode ser desfeita.`)) return
    setDeletingId(id)
    try {
      await deleteCustomer(id)
      await load(pageIndex)
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Falha ao remover paciente.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="page">
      <h1>Pacientes cadastrados</h1>
      <p className="muted">
        Base de pacientes ativos no sistema Atlas Saúde, classificados por plano.
      </p>

      {loading && <p className="muted">Carregando...</p>}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      {page && !loading && (
        <>
          <div className="card">
            {page.empty ? (
              <p className="muted">Nenhum paciente cadastrado ainda.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Plano</th>
                    <th>Cidade</th>
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {page.content.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>
                        <span
                          className={`pill ${c.customerClass === 'PREMIUM' ? 'pill-vip' : 'pill-base'}`}
                        >
                          {c.customerClass === 'PREMIUM' ? 'Premium' : 'Standard'}
                        </span>
                      </td>
                      <td>{c.address?.city ?? '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          disabled={deletingId === c.id}
                          onClick={() => handleDelete(c.id)}
                        >
                          {deletingId === c.id ? 'Removendo...' : 'Remover'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pagination">
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={page.first}
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            >
              Anterior
            </button>
            <span className="muted">
              Página {page.number + 1} de {Math.max(page.totalPages, 1)} ·{' '}
              {page.totalElements} pacientes
            </span>
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={page.last}
              onClick={() => setPageIndex((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </section>
  )
}
