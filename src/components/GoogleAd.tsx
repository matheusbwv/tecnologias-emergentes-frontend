import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>
  }
}

/**
 * ID do publisher do Google AdSense, no formato `ca-pub-XXXXXXXXXXXXXXXX`.
 * Sem essa env, o slot mostra apenas um placeholder e não tenta carregar nada.
 */
const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT ?? ''

/**
 * Modo de teste: enquanto o domínio não está aprovado no AdSense, renderizamos
 * anúncios fictícios (com imagens aleatórias) no lugar do slot real. Assim o
 * plano básico continua mostrando publicidade mesmo sem o AdSense ativo.
 */
const TEST_MODE = import.meta.env.VITE_ADSENSE_TEST === 'true'

type Props = {
  /** ID do ad slot criado no painel do AdSense. */
  slot: string
  /** Formato do anúncio (auto, rectangle, vertical, horizontal, fluid…). */
  format?: string
  /** Label legível mostrado acima do anúncio (exigido pela política de transparência). */
  label?: string
  className?: string
  style?: CSSProperties
}

/** Criativos fictícios usados no modo de teste. */
const MOCK_ADS = [
  { advertiser: 'VitaLab Diagnósticos', headline: 'Check-up completo a partir de R$ 99', cta: 'Agendar agora' },
  { advertiser: 'FarmaPlus', headline: 'Vitaminas e suplementos com 40% OFF', cta: 'Comprar' },
  { advertiser: 'Clínica Bem-Estar', headline: 'Consulta com nutricionista sem custo', cta: 'Quero participar' },
  { advertiser: 'MoveFit Academia', headline: 'Primeiro mês de treino por R$ 1', cta: 'Matricular' },
  { advertiser: 'Seguro Vida+', headline: 'Proteja sua família por R$ 29/mês', cta: 'Simular plano' },
  { advertiser: 'TeleMed 24h', headline: 'Médico online quando você precisar', cta: 'Falar com médico' },
  { advertiser: 'NutriBox', headline: 'Marmitas fit entregues na sua casa', cta: 'Experimentar' },
  { advertiser: 'Óticas Visão', headline: 'Óculos de grau: leve 2, pague 1', cta: 'Ver ofertas' },
  { advertiser: 'SoroVida Hidratação', headline: 'Soroterapia premium com 25% OFF', cta: 'Agendar' },
  { advertiser: 'DermaCare', headline: 'Avaliação de pele gratuita esta semana', cta: 'Marcar avaliação' },
]

/** Dimensões da imagem aleatória conforme o formato do slot. */
function imageDimensions(format: string): [number, number] {
  switch (format) {
    case 'horizontal':
      return [1200, 300]
    case 'vertical':
      return [320, 520]
    case 'rectangle':
      return [320, 250]
    case 'fluid':
      return [640, 380]
    default:
      return [600, 320]
  }
}

/**
 * Slot de Google AdSense. O script global é carregado uma única vez em main.tsx
 * quando `VITE_ADSENSE_CLIENT` está definido. Em modo de teste, mostra um
 * anúncio fictício com imagem aleatória.
 */
export function GoogleAd({
  slot,
  format = 'auto',
  label = 'Anúncio',
  className,
  style,
}: Props) {
  const pushed = useRef(false)

  // Criativo e imagem aleatórios, estáveis durante a vida do componente
  // (mas variam a cada carregamento da página).
  const [ad] = useState(() => MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)])
  const [seed] = useState(() => Math.floor(Math.random() * 1_000_000))

  useEffect(() => {
    // No modo de teste não usamos o AdSense real.
    if (TEST_MODE || !CLIENT || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle ?? []).push({})
    } catch {
      // script ainda não carregou, foi bloqueado por adblock ou estamos fora do domínio aprovado.
    }
  }, [])

  // Anúncio fictício com imagem aleatória (modo de teste / domínio não aprovado).
  if (TEST_MODE) {
    const [w, h] = imageDimensions(format)
    const imageUrl = `https://picsum.photos/seed/atlas-${seed}/${w}/${h}`
    return (
      <aside className={`ad-slot ad-slot-mock ${className ?? ''}`} style={style}>
        <span className="ad-slot-label">{label}</span>
        <a
          className="ad-mock"
          href="#"
          onClick={(e) => e.preventDefault()}
          aria-label={`${ad.advertiser}: ${ad.headline}`}
        >
          <img
            className="ad-mock-img"
            src={imageUrl}
            alt=""
            loading="lazy"
            draggable={false}
          />
          <div className="ad-mock-body">
            <span className="ad-mock-advertiser">{ad.advertiser}</span>
            <strong className="ad-mock-headline">{ad.headline}</strong>
            <span className="ad-mock-cta">{ad.cta}</span>
          </div>
        </a>
      </aside>
    )
  }

  if (!CLIENT) {
    return (
      <aside className={`ad-slot ad-slot-fallback ${className ?? ''}`} style={style}>
        <span className="ad-slot-label">{label}</span>
        <div className="ad-slot-body">
          <strong>Espaço reservado para anúncio</strong>
          <small>
            Defina <code>VITE_ADSENSE_CLIENT=ca-pub-…</code> em <code>.env.local</code>
            {' '}para ativar o Google AdSense.
          </small>
        </div>
      </aside>
    )
  }

  return (
    <aside className={`ad-slot ${className ?? ''}`} style={style}>
      <span className="ad-slot-label">{label}</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 100 }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  )
}
