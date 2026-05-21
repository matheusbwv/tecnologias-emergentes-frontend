import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  createHospital,
  deleteHospital,
  listHospitals,
} from '@/services/hospital'
import { ApiRequestError } from '@/services/api'
import type { Hospital, Page } from '@/types'

export function Hospitais() {
  const [page, setPage] = useState<Page<Hospital> | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [categoryName, setCategoryName] = useState('')
  const [categoryType, setCategoryType] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')

  const load = useCallback(async (index: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listHospitals(index, 10)
      setPage(data)
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Erro ao carregar hospitais.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(pageIndex)
  }, [load, pageIndex])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createHospital({
        categoryName,
        categoryType,
        address: {
          latitude: 0,
          longitude: 0,
          city,
          street,
          houseNumber: Number.parseInt(houseNumber, 10) || 0,
        },
      })
      setCategoryName('')
      setCategoryType('')
      setCity('')
      setStreet('')
      setHouseNumber('')
      await load(pageIndex)
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Falha ao cadastrar hospital.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(`Remover o hospital #${id}?`)) return
    setDeletingId(id)
    try {
      await deleteHospital(id)
      await load(pageIndex)
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Falha ao remover hospital.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="page">
      <h1>Rede de hospitais</h1>
      <p className="muted">
        Unidades parceiras credenciadas para atendimento dos planos Atlas Saúde.
      </p>

      <div className="card">
        <h2>Cadastrar nova unidade</h2>
        <form className="form form-inline" onSubmit={handleCreate}>
          <label className="field">
            <span>Nome / categoria</span>
            <input
              type="text"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Tipo (Público / Privado)</span>
            <input
              type="text"
              required
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Cidade</span>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Rua</span>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Número</span>
            <input
              type="number"
              min="0"
              required
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Cadastrando...' : 'Cadastrar hospital'}
          </button>
        </form>
      </div>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      <div className="card">
        <h2>Unidades cadastradas</h2>
        {loading && <p className="muted">Carregando...</p>}
        {page && !loading && page.empty && (
          <p className="muted">Nenhum hospital cadastrado.</p>
        )}
        {page && !loading && !page.empty && (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Endereço</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {page.content.map((h) => (
                <tr key={h.id}>
                  <td>{h.id}</td>
                  <td>{h.categoryName}</td>
                  <td>{h.categoryType}</td>
                  <td>
                    {h.address
                      ? `${h.address.street}, ${h.address.houseNumber} — ${h.address.city}`
                      : '—'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      disabled={deletingId === h.id}
                      onClick={() => handleDelete(h.id)}
                    >
                      {deletingId === h.id ? 'Removendo...' : 'Remover'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {page && (
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
            Página {page.number + 1} de {Math.max(page.totalPages, 1)}
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
      )}
    </section>
  )
}
