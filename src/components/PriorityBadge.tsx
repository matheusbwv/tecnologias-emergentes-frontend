import type { UserClass } from '@/types'
import { temAcessoIA } from '@/services/userClass'
import { Crown, Clock } from 'lucide-react'

type Props = {
  userClass: UserClass
}

export function PriorityBadge({ userClass }: Props) {
  const vip = temAcessoIA(userClass)
  return (
    <span className={`badge ${vip ? 'badge-vip' : 'badge-base'}`}>
      {vip ? (
        <Crown size={12} strokeWidth={2.4} aria-hidden />
      ) : (
        <Clock size={11} strokeWidth={2.2} aria-hidden />
      )}
      {vip ? 'Prioridade Premium' : 'Atendimento padrão'}
    </span>
  )
}
