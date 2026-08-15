
import { Metadata } from 'next'
import { getArticles } from '@/lib/api'
import AboutGroup from '@/components/about/AboutGroup'

export const revalidate = 3600 

export const metadata: Metadata = {
  title: 'О группе | Россия - Исламский мир',
  description: 'Группа стратегического видения «Россия — Исламский мир» — международная платформа для диалога между Россией и мусульманскими странами. Основатели, миссия, направления деятельности.',
  alternates: {
    canonical: '/about-group',
  },
  openGraph: {
    title: 'О группе | Россия - Исламский мир',
    description: 'Группа стратегического видения «Россия — Исламский мир».',
    url: '/about-group',
    type: 'website',
  },
}

export default async function AboutGroupPage() {
  let initialFounders = null
  try {
    initialFounders = await getArticles({ category: 'founders_and_executives', page: 1 })
  } catch {
  }

  return <AboutGroup initialFounders={initialFounders} />
}