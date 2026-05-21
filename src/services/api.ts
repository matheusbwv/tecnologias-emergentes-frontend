import axios, { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types'

const baseURL =
  import.meta.env.VITE_API_URL ??
  'https://stark-cliffs-43839-e9065399f0e4.herokuapp.com/'

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export class ApiRequestError extends Error {
  status?: number
  path?: string
  raw?: ApiErrorResponse

  constructor(message: string, status?: number, path?: string, raw?: ApiErrorResponse) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.path = path
    this.raw = raw
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const body = error.response?.data
    const status = error.response?.status

    if (body && typeof body === 'object' && 'message' in body) {
      return Promise.reject(
        new ApiRequestError(body.message ?? error.message, status, body.path, body),
      )
    }

    return Promise.reject(
      new ApiRequestError(error.message || 'Erro de comunicação com o servidor.', status),
    )
  },
)
