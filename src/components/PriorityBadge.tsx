import type { UserClass } from '@/types'
import { temAcessoIA, rotuloClasse } from '@/services/userClass'

type Props = {
  userClass: UserClass
}

export function PriorityBadge({ userClass }: Props) {
  const vip = temAcessoIA(userClass)
  return (
    <span className={`badge ${vip ? 'badge-vip' : 'badge-base'}`}>
      <span className="badge-dot" aria-hidden />
      {vip ? 'Prioridade ' : 'Fila padrão · '}
      {rotuloClasse(userClass)}
    </span>
  )
}
