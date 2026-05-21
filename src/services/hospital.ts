import { api } from './api'
import type { CreateHospitalPayload, Hospital, Page } from '@/types'

export async function listHospitals(page = 0, size = 15): Promise<Page<Hospital>> {
  const { data } = await api.get<Page<Hospital>>('/hospital', {
    params: { page, size },
  })
  return data
}

export async function getHospital(id: number): Promise<Hospital> {
  const { data } = await api.get<Hospital>(`/hospital/${id}`)
  return data
}

export async function createHospital(payload: CreateHospitalPayload): Promise<Hospital> {
  const { data } = await api.post<Hospital>('/hospital', payload)
  return data
}

export async function deleteHospital(id: number): Promise<void> {
  await api.delete(`/hospital/${id}`)
}
