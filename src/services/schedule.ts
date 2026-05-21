import { api } from './api'
import type {
  CreateSchedulePayload,
  Page,
  Schedule,
  ScheduleReportRow,
} from '@/types'

export async function listSchedules(page = 0, size = 15): Promise<Page<Schedule>> {
  const { data } = await api.get<Page<Schedule>>('/schedule', {
    params: { page, size },
  })
  return data
}

export async function createSchedule(payload: CreateSchedulePayload): Promise<Schedule> {
  const { data } = await api.post<Schedule>('/schedule', payload)
  return data
}

export async function getSchedulesReport(
  page = 0,
  size = 15,
): Promise<Page<ScheduleReportRow>> {
  const { data } = await api.get<Page<ScheduleReportRow>>('/schedule/reports', {
    params: { page, size },
  })
  return data
}
