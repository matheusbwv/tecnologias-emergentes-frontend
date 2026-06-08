import { useEffect, useState } from 'react'
import { randomPopupAd, unsplashUrl, type MockAd } from './adsData'

/** Intervalo entre os popups de anúncio (ms). */
const INTERVAL_MS = 10000

/**
 * Popup de anúncio do plano básico: a cada 10 segundos aparece um anúncio
 * (diferente do anterior) no canto da tela. Pode ser fechado — e reaparece no
 * próximo ciclo. Usado só no plano básico (o Premium é livre de anúncios).
 */
export function PopupAd() {
  const [ad, setAd] = useState<MockAd | null>(null)
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setImgOk(true)
      setAd(randomPopupAd())
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  if (!ad) return null

  const [c1, c2] = ad.palette
  return (
    <div className="promo-popup" role="dialog" aria-label="Anúncio patrocinado">
      <div className="promo-popup-head">
        <span className="promo-popup-label">Anúncio</span>
        <button
          type="button"
          className="promo-popup-close"
          onClick={() => setAd(null)}
          aria-label="Fechar anúncio"
        >
          ×
        </button>
      </div>
      <div
        className="promo-card promo-popup-card"
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
        role="img"
        aria-label={`${ad.advertiser}: ${ad.headline}`}
      >
        {imgOk && (
          <img
            className="promo-img"
            src={unsplashUrl(ad.photo, 'popup')}
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
    </div>
  )
}
