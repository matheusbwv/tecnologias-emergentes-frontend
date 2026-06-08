import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { takeNextAd, unsplashUrl } from './adsData'

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
 * anúncios fictícios (com imagem temática) no lugar do slot real.
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
 * Slot de Google AdSense. O script global é carregado uma única vez em main.tsx
 * quando `VITE_ADSENSE_CLIENT` está definido. Em modo de teste, mostra um
 * anúncio fictício com foto temática (corte inteligente) e fallback em gradiente.
 */
export function GoogleAd({
  slot,
  format = 'auto',
  label = 'Anúncio',
  className,
  style,
}: Props) {
  const pushed = useRef(false)

  // Anúncio distinto por slot (sem repetir na mesma página), estável durante a
  // vida do componente.
  const [ad] = useState(() => takeNextAd())
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

  // Anúncio fictício com foto temática. Classes neutras ("promo-*", sem "ad")
  // e <div> em vez de <a> para que bloqueadores de anúncio não escondam o card.
  if (TEST_MODE) {
    const [c1, c2] = ad.palette
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
              src={unsplashUrl(ad.photo, format)}
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
