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
 * anúncios fictícios (com imagem temática) no lugar do slot real. Assim o plano
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
 * Criativos fictícios usados no modo de teste. Cada um traz uma foto curada
 * (Unsplash, conferida manualmente) e uma paleta usada como fallback caso a
 * imagem não carregue (rede/adblock) — assim nunca aparece "imagem quebrada".
 */
type MockAd = {
  advertiser: string
  headline: string
  photo: string
  palette: [string, string]
}

const MOCK_ADS: MockAd[] = [
  { advertiser: 'VitaLab Diagnósticos', headline: 'Check-up completo a partir de R$ 99', photo: 'photo-1579154204601-01588f351e67', palette: ['#0ea5e9', '#22d3ee'] },
  { advertiser: 'FarmaPlus', headline: 'Vitaminas e suplementos com 40% OFF', photo: 'photo-1587854692152-cbe660dbde88', palette: ['#14b8a6', '#2dd4bf'] },
  { advertiser: 'Clínica Bem-Estar', headline: 'Consulta com nutricionista sem custo', photo: 'photo-1512621776951-a57141f2eefd', palette: ['#10b981', '#34d399'] },
  { advertiser: 'MoveFit Academia', headline: 'Primeiro mês de treino por R$ 1', photo: 'photo-1534438327276-14e5300c3a48', palette: ['#6366f1', '#8b5cf6'] },
  { advertiser: 'Seguro Vida+', headline: 'Proteja sua família por R$ 29/mês', photo: 'photo-1511895426328-dc8714191300', palette: ['#3b82f6', '#60a5fa'] },
  { advertiser: 'TeleMed 24h', headline: 'Médico online quando você precisar', photo: 'photo-1576091160399-112ba8d25d1d', palette: ['#0284c7', '#38bdf8'] },
  { advertiser: 'NutriBox', headline: 'Marmitas fit entregues na sua casa', photo: 'photo-1546069901-ba9599a7e63c', palette: ['#f59e0b', '#fb923c'] },
  { advertiser: 'Óticas Visão', headline: 'Óculos de grau: leve 2, pague 1', photo: 'photo-1574258495973-f010dfbb5371', palette: ['#8b5cf6', '#a855f7'] },
  { advertiser: 'SoroVida Hidratação', headline: 'Soroterapia premium com 25% OFF', photo: 'photo-1540555700478-4be289fbecef', palette: ['#06b6d4', '#22d3ee'] },
  { advertiser: 'DermaCare', headline: 'Avaliação de pele gratuita esta semana', photo: 'photo-1556228578-8c89e6adf883', palette: ['#ec4899', '#f472b6'] },
]

/**
 * Slot de Google AdSense. O script global é carregado uma única vez em main.tsx
 * quando `VITE_ADSENSE_CLIENT` está definido. Em modo de teste, mostra um
 * anúncio fictício com imagem temática (foto real) e fallback em gradiente.
 */
export function GoogleAd({
  slot,
  format = 'auto',
  label = 'Anúncio',
  className,
  style,
}: Props) {
  const pushed = useRef(false)

  // Criativo aleatório, estável durante a vida do componente
  // (mas varia a cada carregamento da página).
  const [ad] = useState(() => MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)])
  const [imgOk, setImgOk] = useState(true)

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

  // Anúncio fictício com imagem temática. Classes neutras ("promo-*", sem "ad")
  // e <div> em vez de <a> para que bloqueadores de anúncio não escondam o card.
  if (TEST_MODE) {
    const [c1, c2] = ad.palette
    const imageUrl = `https://images.unsplash.com/${ad.photo}?auto=format&fit=crop&w=800&q=70`
    return (
      <aside className={`promo-slot ${className ?? ''}`} style={style}>
        <span className="promo-slot-label">{label}</span>
        <div
          className="promo-card"
          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          role="img"
          aria-label={`${ad.advertiser}: ${ad.headline}`}
        >
          {imgOk && (
            <img
              className="promo-img"
              src={imageUrl}
              alt=""
              loading="lazy"
              draggable={false}
              onError={() => setImgOk(false)}
            />
          )}
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
