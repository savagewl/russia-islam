import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getExpertById } from '@/lib/api'
import ExpertDetailClient from './ExpertDetailClient'
import '../../../styles/islamInRussia.css'
import '../../../styles/scientificArticle.css'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const expert = await getExpertById(Number(id))
    const title = `${expert.name}`
    const description = expert.description
    return {
      title,
      description,
      alternates: { canonical: `/experts/${id}` },
      openGraph: {
        title, description, url: `/experts/${id}`, type: 'profile',
        images: expert.preview_image_url ? [{ url: expert.preview_image_url, width: 400, height: 400, alt: expert.name }] : [],
      },
      twitter: { card: 'summary_large_image', title, description, images: expert.preview_image_url ? [expert.preview_image_url] : [] },
    }
  } catch {
    return { title: 'Эксперт | Россия - Исламский мир' }
  }
}

export default async function ExpertDetailPage({ params }: Props) {
  const { id } = await params
  let expert
  try {
    expert = await getExpertById(Number(id))
  } catch {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: expert.name,
      description: expert.description,
      url: `https://rusislworld.ru/experts/${id}`,
      ...(expert.preview_image_url ? { image: expert.preview_image_url } : {}),
      affiliation: { '@type': 'Organization', name: 'Группа стратегического видения «Россия — Исламский мир»', url: 'https://rusislworld.ru' },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ExpertDetailClient id={Number(id)} initialExpert={expert} />
    </>
  )
}
