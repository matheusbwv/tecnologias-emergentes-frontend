export type UserClass = 'A' | 'B' | 'C' | 'D' | 'E'

export type CustomerClassBack = 'STANDARD' | 'PREMIUM'

export type ExamTypeBack = 'HEMOGRAM' | 'BIOCHEMICAL' | 'IMAGING'

export type Address = {
  id?: number
  latitude: number
  longitude: number
  city: string
  street: string
  houseNumber: number
}

export type AddressPayload = Omit<Address, 'id'>

export type Customer = {
  id: number
  name: string
  email: string
  customerClass: CustomerClassBack
  address: Address
}

export type CreateCustomerPayload = {
  name: string
  email: string
  customerClass: CustomerClassBack
  address: AddressPayload
}

export type Hospital = {
  id: number
  categoryName: string
  categoryType: string
  address: Address
}

export type CreateHospitalPayload = {
  categoryName: string
  categoryType: string
  address: AddressPayload
}

export type ExamComponent = {
  value: number
  unit: string
  ref: string
}

export type Erythrogram = {
  rbc: ExamComponent
  hemoglobin: ExamComponent
}

export type Leukogram = {
  wbc_total: ExamComponent
}

export type Platelets = {
  count: number
}

export type ExamData = {
  erythrogram: Erythrogram
  leukogram: Leukogram
  platelets: Platelets
}

export type Exam = {
  id: number
  customer: Customer
  type: ExamTypeBack
  orderDate: string
  examData: ExamData
  isAbnormal: boolean
}

export type CreateExamPayload = {
  customerId: number
  type: ExamTypeBack
  examData: ExamData
  isAbnormal?: boolean
}

export type HemogramResponseDTO = {
  examId: number
  customerId: number
  customerClass: CustomerClassBack
  examData: ExamData
  observation?: string | null
}

export type ExamReportRow = {
  patient: string
  testType: string
  orderDate: string
  hemoglobinResult: string
}

export type Schedule = {
  id: number
  serviceCode: number
  hospital: Hospital
  customer: Customer
  scheduledAt: string
}

export type CreateSchedulePayload = {
  serviceCode: number
  hospitalId: number
  customerId: number
  scheduledAt: string
}

export type ScheduleReportRow = {
  scheduledAt: string
  patient: string
  hospital: string
}

export type AutoScheduleResponse = {
  scheduleId: number
  serviceCode: number
  scheduledAt: string
  customerId: number
  customerName: string
  customerClass: CustomerClassBack
  customerAddress: Address | null
  hospitalId: number
  hospitalName: string
  hospitalType: string
  hospitalAddress: Address | null
}

export type CustomerCreateResponse = {
  id: number
  name: string
  email: string
  customerClass: CustomerClassBack
  address: Address
  autoSchedule: AutoScheduleResponse | null
}

export type Page<T> = {
  content: T[]
  number: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  empty: boolean
}

export type User = {
  id: string
  customerId: number
  nome: string
  email: string
  profissao: string
  renda: number
  cep: string
  userClass: UserClass
}

export type ApiErrorResponse = {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export type ApiError = {
  message: string
  status?: number
}
