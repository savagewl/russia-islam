
import { Metadata } from 'next'
import { Suspense } from 'react'
import ArticlesList from '@/components/articles/ArticlesList'
import { CATEGORY_LABELS } from '@/lib/api'

export const revalidate = 60

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, search } = await searchParams

  let title = 'Все статьи | Россия - Исламский мир'
  let description = 'Все статьи и материалы группы стратегического видения «Россия — Исламский мир».'
  let canonical = '/articles'

  if (category && CATEGORY_LABELS[category]) {
    const label = CATEGORY_LABELS[category]
    title = `${label} | Россия - Исламский мир`
    description = `Материалы по теме «${label}» — группа стратегического видения «Россия — Исламский мир».`
    canonical = `/articles?category=${category}`
  } else if (search) {
    title = `Поиск: ${search} | Россия - Исламский мир`
    description = `Результаты поиска по запросу «${search}» на сайте группы «Россия — Исламский мир».`
    canonical = `/articles?search=${encodeURIComponent(search)}`
  }

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
  }
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#7C7C7C' }}>
        Загрузка...
      </div>
    }>
      <ArticlesList />
    </Suspense>
  )
}