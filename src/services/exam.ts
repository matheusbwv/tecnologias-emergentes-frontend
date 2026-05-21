import { api } from './api'
import type {
  CreateExamPayload,
  Exam,
  ExamReportRow,
  HemogramResponseDTO,
  Page,
} from '@/types'

export async function getCustomerHemogram(customerId: number): Promise<HemogramResponseDTO> {
  const { data } = await api.get<HemogramResponseDTO>(
    `/exam/customer/${customerId}/hemogram`,
  )
  return data
}

export async function listExams(page = 0, size = 15): Promise<Page<Exam>> {
  const { data } = await api.get<Page<Exam>>('/exam', { params: { page, size } })
  return data
}

export async function getExam(id: number): Promise<Exam> {
  const { data } = await api.get<Exam>(`/exam/${id}`)
  return data
}

export async function createExam(payload: CreateExamPayload): Promise<Exam> {
  const { data } = await api.post<Exam>('/exam', payload)
  return data
}

export async function getNormalExamsReport(
  page = 0,
  size = 15,
): Promise<Page<ExamReportRow>> {
  const { data } = await api.get<Page<ExamReportRow>>('/exam/reports/normal', {
    params: { page, size },
  })
  return data
}
