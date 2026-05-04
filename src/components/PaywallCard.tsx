type Props = {
  titulo: string
  descricao: string
}

export function PaywallCard({ titulo, descricao }: Props) {
  return (
    <div className="paywall" role="region" aria-label="Conteúdo bloqueado">
      <div className="paywall-lock" aria-hidden>
        🔒
      </div>
      <div>
        <h3 className="paywall-title">{titulo}</h3>
        <p className="paywall-desc">{descricao}</p>
        <button type="button" className="paywall-cta" disabled>
          Faça upgrade para acessar
        </button>
      </div>
    </div>
  )
}
