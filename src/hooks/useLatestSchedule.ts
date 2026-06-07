import { useEffect, useState } from 'react'
import { getLatestScheduleForCustomer } from '@/services/schedule'
import { ApiRequestError } from '@/services/api'
import type { AutoScheduleResponse } from '@/types'

type State = {
  data: AutoScheduleResponse | null
  loading: boolean
  error: string | null
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function useLatestSchedule(customerId: number | null | undefined) {
  const [state, setState] = useState<State>({
    data: null,
    loading: false,
    error: null,
  })

  useEffect(() => {
    if (customerId == null) {
      setState({ data: null, loading: false, error: null })
      return
    }

    if (USE_MOCK) {
      setState({ data: null, loading: false, error: null })
      return
    }

    let cancelled = false
    setState({ data: null, loading: true, error: null })

    getLatestScheduleForCustomer(customerId)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        // 404 é esperado para pacientes STANDARD sem agendamento automático.
        if (err instanceof ApiRequestError && err.status === 404) {
          setState({ data: null, loading: false, error: null })
          return
        }
        const message =
          err instanceof ApiRequestError
            ? err.message
            : 'Não foi possível carregar o agendamento.'
        setState({ data: null, loading: false, error: message })
      })

    return () => {
      cancelled = true
    }
  }, [customerId])

  return state
}
