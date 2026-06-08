/**
 * Catálogo de anúncios fictícios (modo de teste do AdSense) + utilitários.
 * As fotos vêm do Unsplash com corte inteligente (`crop=faces,entropy`) no
 * tamanho de cada slot, evitando imagem "esticada"/super cortada.
 */

export type MockAd = {
  advertiser: string
  headline: string
  /** ID da foto no Unsplash (conferida manualmente para casar com o tema). */
  photo: string
  /** Paleta usada como fallback (gradiente) se a imagem não carregar. */
  palette: [string, string]
}

export const MOCK_ADS: MockAd[] = [
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

/** Dimensões da imagem por formato de slot (combinam com a proporção do bloco). */
function dimensionsFor(format: string): { w: number; h: number } {
  switch (format) {
    case 'horizontal':
      return { w: 1280, h: 300 }
    case 'fluid':
      return { w: 1100, h: 320 }
    case 'vertical':
      return { w: 600, h: 520 }
    case 'rectangle':
      return { w: 600, h: 460 }
    case 'popup':
      return { w: 640, h: 360 }
    default:
      return { w: 800, h: 460 }
  }
}

/** URL da foto no Unsplash com corte inteligente no tamanho do slot. */
export function unsplashUrl(photo: string, format = 'auto'): string {
  const { w, h } = dimensionsFor(format)
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&crop=faces,entropy&w=${w}&h=${h}&q=70`
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Fila embaralhada: cada slot da página pega um anúncio distinto. Ao esgotar,
// reembaralha. Como o módulo é reavaliado a cada carregamento da página, a
// ordem muda a cada refresh (anúncios diferentes a cada atualização).
let pool: MockAd[] = []

/** Próximo anúncio sem repetir entre os slots da mesma página. */
export function takeNextAd(): MockAd {
  if (pool.length === 0) pool = shuffle(MOCK_ADS)
  return pool.pop() as MockAd
}

// Para os popups: evita repetir o anúncio imediatamente anterior.
let lastPopup: MockAd | null = null

/** Anúncio aleatório para popup, diferente do popup anterior. */
export function randomPopupAd(): MockAd {
  let ad = MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)]
  while (ad === lastPopup && MOCK_ADS.length > 1) {
    ad = MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)]
  }
  lastPopup = ad
  return ad
}
