import { useEffect, useState } from 'react'

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

/** Para onde o QR aponta — um site de empréstimo (a piada do plano de R$ 10.000). */
const LOAN_URL = 'https://www.google.com/search?q=empréstimo+pessoal+online+rápido'

const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
  LOAN_URL,
)}`

/**
 * Popup (modal com fundo escurecido) que apresenta o plano Atlas Premium.
 * Etapa 1: benefícios + valor. Etapa 2: QR code de "pagamento" que leva a um
 * site de empréstimo (R$ 10.000 não cabe no bolso — financie!).
 */
export function PremiumModal({ open, onClose }: Props) {
  const [step, setStep] = useState<'plan' | 'pay'>('plan')
  const [qrOk, setQrOk] = useState(true)

  // Sempre reabre na etapa do plano.
  useEffect(() => {
    if (open) {
      setStep('plan')
      setQrOk(true)
    }
  }, [open])

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

        {step === 'plan' ? (
          <>
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

            <button
              type="button"
              className="premium-modal-cta"
              onClick={() => setStep('pay')}
            >
              Quero ser Premium
            </button>
            <p className="premium-modal-fine">
              Valores simulados para fins de demonstração acadêmica.
            </p>
          </>
        ) : (
          <>
            <span className="premium-modal-eyebrow">★ Atlas Premium</span>
            <h2 className="premium-modal-title">Finalize sua assinatura</h2>
            <p className="premium-modal-sub">
              Aponte a câmera do celular para o código e conclua o pagamento de{' '}
              <strong className="premium-modal-amount">R$ 10.000</strong>.
            </p>

            <a
              className="premium-modal-qr"
              href={LOAN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {qrOk ? (
                <img
                  src={QR_SRC}
                  alt="QR code para concluir o pagamento"
                  width={220}
                  height={220}
                  onError={() => setQrOk(false)}
                />
              ) : (
                <span className="premium-modal-qr-fallback">
                  Não foi possível exibir o QR.
                  <br />
                  Toque aqui para continuar.
                </span>
              )}
            </a>

            <p className="premium-modal-loan">
              Sem R$ 10.000 agora? 😅 Parcele em até <strong>360x</strong> — o QR
              te leva direto ao crédito.
            </p>

            <button
              type="button"
              className="premium-modal-cta premium-modal-cta-ghost"
              onClick={() => setStep('plan')}
            >
              Voltar
            </button>
          </>
        )}
      </div>
    </div>
  )
}
