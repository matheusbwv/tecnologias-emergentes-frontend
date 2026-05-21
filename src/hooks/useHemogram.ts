import { useEffect, useState } from 'react'
import { getCustomerHemogram } from '@/services/exam'
import { ApiRequestError } from '@/services/api'
import type { HemogramResponseDTO } from '@/types'

type State = {
  data: HemogramResponseDTO | null
  loading: boolean
  error: string | null
}

export function useHemogram(customerId: number | null | undefined) {
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

    let cancelled = false
    setState({ data: null, loading: true, error: null })

    getCustomerHemogram(customerId)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message =
          err instanceof ApiRequestError
            ? err.message
            : 'Não foi possível carregar o hemograma.'
        setState({ data: null, loading: false, error: message })
      })

    return () => {
      cancelled = true
    }
  }, [customerId])

  return state
}
