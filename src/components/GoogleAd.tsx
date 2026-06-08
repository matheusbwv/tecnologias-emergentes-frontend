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
 * anúncios fictícios (com arte aleatória) no lugar do slot real. Assim o plano
 * básico continua mostrando publicidade mesmo sem o AdSense ativo.
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

/** Paletas de cor para a arte aleatória dos anúncios fictícios. */
const PALETTES: Array<[string, string]> = [
  ['#6366f1', '#8b5cf6'],
  ['#0ea5e9', '#22d3ee'],
  ['#10b981', '#34d399'],
  ['#f59e0b', '#fb923c'],
  ['#ef4444', '#f87171'],
  ['#ec4899', '#f472b6'],
  ['#14b8a6', '#2dd4bf'],
  ['#3b82f6', '#60a5fa'],
]

/** Gerador pseudo-aleatório determinístico (LCG) a partir de uma semente. */
function makeRng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/**
 * Monta um `background` CSS aleatório (gradiente + "blobs" de luz) determinístico
 * pela semente. É 100% local: não depende de rede, então nunca quebra.
 */
function randomArtBackground(seed: number): string {
  const [c1, c2] = PALETTES[seed % PALETTES.length]
  const rand = makeRng(seed + 11)
  const blob = (op: number) =>
    `radial-gradient(circle at ${Math.round(rand() * 100)}% ${Math.round(
      rand() * 100,
    )}%, rgba(255,255,255,${op}) 0, transparent ${35 + Math.round(rand() * 20)}%)`
  return `${blob(0.28)}, ${blob(0.2)}, ${blob(0.16)}, linear-gradient(135deg, ${c1}, ${c2})`
}

/**
 * Slot de Google AdSense. O script global é carregado uma única vez em main.tsx
 * quando `VITE_ADSENSE_CLIENT` está definido. Em modo de teste, mostra um
 * anúncio fictício com arte aleatória gerada localmente.
 */
export function GoogleAd({
  slot,
  format = 'auto',
  label = 'Anúncio',
  className,
  style,
}: Props) {
  const pushed = useRef(false)

  // Criativo e arte aleatórios, estáveis durante a vida do componente
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

  // Anúncio fictício com arte aleatória (modo de teste / domínio não aprovado).
  // Usamos classes neutras ("promo-*", sem "ad") e <div> em vez de <a> para que
  // bloqueadores de anúncio não escondam o card.
  if (TEST_MODE) {
    return (
      <aside className={`promo-slot ${className ?? ''}`} style={style}>
        <span className="promo-slot-label">{label}</span>
        <div
          className="promo-card"
          style={{ background: randomArtBackground(seed) }}
          role="img"
          aria-label={`${ad.advertiser}: ${ad.headline}`}
        >
          <span className="promo-monogram" aria-hidden>
            {ad.advertiser.charAt(0)}
          </span>
          <span className="promo-scrim" aria-hidden />
          <span className="promo-body">
            <span className="promo-advertiser">{ad.advertiser}</span>
            <strong className="promo-headline">{ad.headline}</strong>
            <span className="promo-cta">{ad.cta}</span>
          </span>
        </div>
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
