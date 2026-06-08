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
 * anúncios fictícios (com arte temática) no lugar do slot real. Assim o plano
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

/**
 * Criativos fictícios usados no modo de teste. Cada um traz um ícone e uma
 * paleta que combinam com o que está sendo anunciado ("imagem conforme o texto").
 */
type MockAd = {
  advertiser: string
  headline: string
  icon: string
  palette: [string, string]
}

const MOCK_ADS: MockAd[] = [
  { advertiser: 'VitaLab Diagnósticos', headline: 'Check-up completo a partir de R$ 99', icon: '🔬', palette: ['#0ea5e9', '#22d3ee'] },
  { advertiser: 'FarmaPlus', headline: 'Vitaminas e suplementos com 40% OFF', icon: '💊', palette: ['#14b8a6', '#2dd4bf'] },
  { advertiser: 'Clínica Bem-Estar', headline: 'Consulta com nutricionista sem custo', icon: '🥗', palette: ['#10b981', '#34d399'] },
  { advertiser: 'MoveFit Academia', headline: 'Primeiro mês de treino por R$ 1', icon: '🏋️', palette: ['#6366f1', '#8b5cf6'] },
  { advertiser: 'Seguro Vida+', headline: 'Proteja sua família por R$ 29/mês', icon: '🛡️', palette: ['#3b82f6', '#60a5fa'] },
  { advertiser: 'TeleMed 24h', headline: 'Médico online quando você precisar', icon: '📱', palette: ['#0284c7', '#38bdf8'] },
  { advertiser: 'NutriBox', headline: 'Marmitas fit entregues na sua casa', icon: '🍱', palette: ['#f59e0b', '#fb923c'] },
  { advertiser: 'Óticas Visão', headline: 'Óculos de grau: leve 2, pague 1', icon: '👓', palette: ['#8b5cf6', '#a855f7'] },
  { advertiser: 'SoroVida Hidratação', headline: 'Soroterapia premium com 25% OFF', icon: '💧', palette: ['#06b6d4', '#22d3ee'] },
  { advertiser: 'DermaCare', headline: 'Avaliação de pele gratuita esta semana', icon: '✨', palette: ['#ec4899', '#f472b6'] },
]

/** Gerador pseudo-aleatório determinístico (LCG) a partir de uma semente. */
function makeRng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/**
 * Monta um `background` CSS (gradiente da paleta do anúncio + "blobs" de luz
 * posicionados pela semente). É 100% local: não depende de rede, nunca quebra.
 */
function artBackground(seed: number, palette: [string, string]): string {
  const [c1, c2] = palette
  const rand = makeRng(seed + 11)
  const blob = (op: number) =>
    `radial-gradient(circle at ${Math.round(rand() * 100)}% ${Math.round(
      rand() * 100,
    )}%, rgba(255,255,255,${op}) 0, transparent ${35 + Math.round(rand() * 20)}%)`
  return `${blob(0.26)}, ${blob(0.18)}, ${blob(0.14)}, linear-gradient(135deg, ${c1}, ${c2})`
}

/**
 * Slot de Google AdSense. O script global é carregado uma única vez em main.tsx
 * quando `VITE_ADSENSE_CLIENT` está definido. Em modo de teste, mostra um
 * anúncio fictício com arte temática gerada localmente.
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

  // Anúncio fictício com arte temática. Classes neutras ("promo-*", sem "ad")
  // e <div> em vez de <a> para que bloqueadores de anúncio não escondam o card.
  if (TEST_MODE) {
    return (
      <aside className={`promo-slot ${className ?? ''}`} style={style}>
        <span className="promo-slot-label">{label}</span>
        <div
          className="promo-card"
          style={{ background: artBackground(seed, ad.palette) }}
          role="img"
          aria-label={`${ad.advertiser}: ${ad.headline}`}
        >
          <span className="promo-icon" aria-hidden>
            {ad.icon}
          </span>
          <span className="promo-scrim" aria-hidden />
          <span className="promo-body">
            <span className="promo-advertiser">{ad.advertiser}</span>
            <strong className="promo-headline">{ad.headline}</strong>
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
