import { api } from './api'
import type { Address, AddressPayload, Page } from '@/types'

export async function listAddresses(page = 0, size = 10): Promise<Page<Address>> {
  const { data } = await api.get<Page<Address>>('/address', {
    params: { page, size },
  })
  return data
}

export async function getAddress(id: number): Promise<Address> {
  const { data } = await api.get<Address>(`/address/${id}`)
  return data
}

export async function createAddress(payload: AddressPayload): Promise<Address> {
  const { data } = await api.post<Address>('/address', payload)
  return data
}

export async function updateAddress(
  id: number,
  payload: AddressPayload,
): Promise<Address> {
  const { data } = await api.patch<Address>(`/address/${id}`, payload)
  return data
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/address/${id}`)
}
