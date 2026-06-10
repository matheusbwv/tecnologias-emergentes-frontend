type Props = {
  open: boolean
  onClose: () => void
}

const FEATURES = [
  'Gráficos de evolução clínica dos seus exames',
  'Laudo imediato por inteligência artificial (Atlas IA)',
  'Agendamento prioritário no hospital mais próximo',
  'Experiência 100% sem anúncios',
  'Atendimento concierge 24 horas',
]

/**
 * Popup (modal com fundo escurecido) que apresenta o plano Atlas Premium e o
 * valor, acionado pelos botões "Conhecer Atlas Premium" do plano básico.
 */
export function PremiumModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div
      className="premium-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Plano Atlas Premium"
      onClick={onClose}
    >
      <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="premium-modal-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <span className="premium-modal-eyebrow">★ Atlas Premium</span>
        <h2 className="premium-modal-title">Cuidado clínico sem limites</h2>
        <p className="premium-modal-sub">
          Tudo que o plano básico mantém bloqueado, liberado para você.
        </p>

        <ul className="premium-modal-features">
          {FEATURES.map((f) => (
            <li key={f}>
              <span className="premium-modal-check" aria-hidden>
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="premium-modal-price">
          <span className="premium-modal-price-from">por apenas</span>
          <div className="premium-modal-price-main">
            <span className="premium-modal-price-value">R$ 10.000</span>
            <span className="premium-modal-price-period">/mês</span>
          </div>
        </div>

        <button type="button" className="premium-modal-cta" onClick={onClose}>
          Quero ser Premium
        </button>
        <p className="premium-modal-fine">
          Valores simulados para fins de demonstração acadêmica.
        </p>
      </div>
    </div>
  )
}
