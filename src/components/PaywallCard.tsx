import { Lock } from 'lucide-react'

type Props = {
  titulo: string
  descricao: string
}

export function PaywallCard({ titulo, descricao }: Props) {
  return (
    <div className="paywall" role="region" aria-label="Recurso do plano Premium">
      <div className="paywall-lock" aria-hidden>
        <Lock size={22} strokeWidth={2.2} />
      </div>
      <div>
        <h3 className="paywall-title">{titulo}</h3>
        <p className="paywall-desc">{descricao}</p>
        <button type="button" className="paywall-cta">
          Conhecer o plano Premium
        </button>
      </div>
    </div>
  )
}
