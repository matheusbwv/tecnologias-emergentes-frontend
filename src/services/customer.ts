import { api } from './api'
import type {
  CreateCustomerPayload,
  Customer,
  Page,
} from '@/types'

export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
  const { data } = await api.post<Customer>('/customer', payload)
  return data
}

export async function getCustomer(id: number): Promise<Customer> {
  const { data } = await api.get<Customer>(`/customer/${id}`)
  return data
}

export async function listCustomers(page = 0, size = 15): Promise<Page<Customer>> {
  const { data } = await api.get<Page<Customer>>('/customer', {
    params: { page, size },
  })
  return data
}

export async function updateCustomer(
  id: number,
  payload: CreateCustomerPayload,
): Promise<Customer> {
  const { data } = await api.put<Customer>(`/customer/${id}`, payload)
  return data
}

export async function deleteCustomer(id: number): Promise<void> {
  await api.delete(`/customer/${id}`)
}
