export type UserClass = 'A' | 'B' | 'C' | 'D' | 'E'

export type User = {
  id: string
  nome: string
  profissao: string
  renda: number
  cep: string
  userClass: UserClass
}

export type Hemograma = {
  hemoglobina: number
  leucocitos: number
  hematocrito: number
  plaquetas: number
  timestamp: string
}

export type DiagnosticoIA = {
  resumo: string
  alertas: string[]
  recomendacao: string
}

export type ApiError = {
  message: string
  status?: number
}
