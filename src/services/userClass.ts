import type { UserClass } from '@/types'

const PROFISSAO_PESOS: Record<string, number> = {
  medico: 100,
  advogado: 95,
  engenheiro: 90,
  empresario: 90,
  professor: 70,
  enfermeiro: 60,
  comerciante: 55,
  tecnico: 50,
  vendedor: 40,
  motorista: 35,
  autonomo: 30,
  domestica: 20,
  desempregado: 0,
}

export const PROFISSOES = Object.keys(PROFISSAO_PESOS)

export function pesoProfissao(prof: string): number {
  return PROFISSAO_PESOS[prof.toLowerCase().trim()] ?? 30
}

export function pesoRenda(renda: number): number {
  if (renda >= 20000) return 100
  if (renda >= 10000) return 80
  if (renda >= 5000) return 60
  if (renda >= 3000) return 40
  if (renda >= 1500) return 20
  return 10
}

export function pesoCep(cep: string): number {
  const numeros = cep.replace(/\D/g, '')
  if (numeros.length < 5) return 30
  const prefix = Number.parseInt(numeros.substring(0, 5), 10)
  if (prefix < 5000) return 90
  if (prefix < 10000) return 60
  if (prefix < 30000) return 50
  if (prefix < 60000) return 40
  return 30
}

export function calcularClasse(
  profissao: string,
  renda: number,
  cep: string,
): UserClass {
  const score =
    pesoProfissao(profissao) * 0.35 +
    pesoRenda(renda) * 0.45 +
    pesoCep(cep) * 0.2

  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  if (score >= 40) return 'C'
  if (score >= 20) return 'D'
  return 'E'
}

export function temAcessoIA(classe: UserClass): boolean {
  return classe === 'A' || classe === 'B'
}

export function rotuloClasse(classe: UserClass): string {
  const rotulos: Record<UserClass, string> = {
    A: 'Premium',
    B: 'VIP',
    C: 'Padrão',
    D: 'Básico',
    E: 'Essencial',
  }
  return rotulos[classe]
}
