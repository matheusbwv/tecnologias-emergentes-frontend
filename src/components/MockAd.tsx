import { useMemo } from 'react'
import type { CSSProperties } from 'react'

/**
 * MockAd — placeholder visual de anúncio para uso enquanto a aprovação
 * do AdSense não sai. Gera anúncio "convincente" com imagem aleatória do
 * Picsum + cópia rotativa. Substitui o <GoogleAd> nos slots do plano básico.
 *
 * Quando o AdSense aprovar o site, é só voltar a usar <GoogleAd> nos mesmos
 * lugares — o layout/CSS já está pronto.
 */

type AdCopy = {
  headline: string
  body: string
  cta: string
  advertiser: string
  url: string
}

/** Cópias temáticas pra reforçar a tese de estratificação (anúncios direcionados a classe baixa) */
const COPIES: AdCopy[] = [
  {
    headline: 'Genérico até 70% mais barato',
    body: 'Compare preços de medicamentos próximos à sua casa. Entrega em 2h.',
    cta: 'Comparar agora',
    advertiser: 'FarmaJá',
    url: '#',
  },
  {
    headline: 'Empréstimo aprovado em 5 minutos',
    body: 'Mesmo com nome sujo. Sem consulta SPC/Serasa. Parcele em até 36x.',
    cta: 'Simular crédito',
    advertiser: 'CrediFácil',
    url: '#',
  },
  {
    headline: 'Curso técnico em saúde · 6 meses',
    body: 'Auxiliar de enfermagem, técnico em farmácia, recepção hospitalar.',
    cta: 'Ver bolsas disponíveis',
    advertiser: 'Instituto Práxis',
    url: '#',
  },
  {
    headline: 'Plano odontológico por R$ 29,90/mês',
    body: 'Sem carência. Atendimento 24h em todo o Brasil. Cobre família toda.',
    cta: 'Contratar agora',
    advertiser: 'OdontoMax',
    url: '#',
  },
  {
    headline: 'Cesta básica com 35% de desconto',
    body: 'Use o cupom CESTA35. Pagamento no boleto ou no cartão.',
    cta: 'Comprar',
    advertiser: 'Atacado Popular',
    url: '#',
  },
  {
    headline: 'Receba até R$ 1.200 do governo',
    body: 'Veja se você tem direito ao Auxílio Emergencial. Cadastro rápido.',
    cta: 'Verificar elegibilidade',
    advertiser: 'Portal Benefícios',
    url: '#',
  },
  {
    headline: 'Consulta médica online por R$ 49',
    body: 'Clínico geral 24h sem sair de casa. Receita digital válida.',
    cta: 'Agendar consulta',
    advertiser: 'Saúde Já',
    url: '#',
  },
  {
    headline: 'Concurso público · vagas abertas',
    body: 'Inscrições até esta sexta. Salários a partir de R$ 4.500.',
    cta: 'Ver edital',
    advertiser: 'Concursa+',
    url: '#',
  },
]

function pickCopy(seed: number): AdCopy {
  return COPIES[seed % COPIES.length]
}

type Layout = 'banner' | 'infeed' | 'rail'

type Props = {
  layout?: Layout
  label?: string
  className?: string
  style?: CSSProperties
}

export function MockAd({ layout = 'infeed', label = 'Patrocinado', className, style }: Props) {
  // Sorteio fixo por instância (não troca a cada render)
  const seed = useMemo(() => Math.floor(Math.random() * 10_000), [])
  const copy = useMemo(() => pickCopy(seed), [seed])

  const imageDims =
    layout === 'banner'
      ? { w: 180, h: 100 }
      : layout === 'rail'
        ? { w: 280, h: 160 }
        : { w: 240, h: 160 }
  const img = `https://picsum.photos/seed/atlas-${seed}/${imageDims.w}/${imageDims.h}`

  return (
    <aside className={`ad-slot mock-ad mock-ad-${layout} ${className ?? ''}`} style={style}>
      <span className="ad-slot-label">{label}</span>
      <a className="mock-ad-body" href={copy.url} target="_blank" rel="noopener noreferrer sponsored">
        <div className="mock-ad-media">
          <img src={img} alt="" loading="lazy" width={imageDims.w} height={imageDims.h} />
        </div>
        <div className="mock-ad-text">
          <span className="mock-ad-advertiser">{copy.advertiser}</span>
          <strong className="mock-ad-headline">{copy.headline}</strong>
          <p className="mock-ad-desc">{copy.body}</p>
          <span className="mock-ad-cta">{copy.cta} →</span>
        </div>
      </a>
    </aside>
  )
}
