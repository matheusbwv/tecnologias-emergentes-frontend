import { api } from './api'
import type {
  CreateCustomerPayload,
  Customer,
  Page,
} from '@/types'

/** Modo offline para testar o front sem o back (VITE_USE_MOCK=true) */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockCustomer(payload: CreateCustomerPayload): Customer {
  return {
    id: Math.floor(1000 + Math.random() * 9000),
    name: payload.name,
    email: payload.email,
    customerClass: payload.customerClass,
    address: { id: 1, ...payload.address },
  }
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    return mockCustomer(payload)
  }
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
