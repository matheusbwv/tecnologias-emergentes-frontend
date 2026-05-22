import { useEffect, useState } from 'react'
import { getCustomerHemogram } from '@/services/exam'
import { ApiRequestError } from '@/services/api'
import type { HemogramResponseDTO } from '@/types'

type State = {
  data: HemogramResponseDTO | null
  loading: boolean
  error: string | null
}

/** Modo mock para testar o front sem o back (ativado via VITE_USE_MOCK=true) */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockHemogram(customerId: number): HemogramResponseDTO {
  return {
    examId: 9000 + customerId,
    customerId,
    customerClass: 'PREMIUM',
    examData: {
      erythrogram: {
        rbc: { value: 4.2, unit: '10^6/µL', ref: '4.1-6.0' },
        hemoglobin: { value: 13.8, unit: 'g/dL', ref: '12.0-17.5' },
      },
      leukogram: {
        wbc_total: { value: 7200, unit: '/µL', ref: '4500-11000' },
      },
      platelets: { count: 389908 },
    },
    observation:
      'Prezado paciente,\n\n' +
      'Aqui está a análise do seu hemograma. Vamos começar pelos resultados do eritrograma, ' +
      'que avalia as células vermelhas do sangue. Seu valor de glóbulos vermelhos (RBC) é de ' +
      '4,2 milhões por microlitro, o que está dentro da faixa de referência.\n\n' +
      '- Hemoglobina dentro do limite de referência.\n' +
      '- Contagem de leucócitos dentro da normalidade clínica.\n' +
      '- Plaquetas em valor adequado, sem sinais de alteração.\n\n' +
      'No geral, o hemograma não apresenta alterações relevantes. (dados simulados — modo offline)',
  }
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

    if (USE_MOCK) {
      setState({ data: null, loading: true, error: null })
      const timer = setTimeout(() => {
        setState({ data: mockHemogram(customerId), loading: false, error: null })
      }, 400)
      return () => clearTimeout(timer)
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
