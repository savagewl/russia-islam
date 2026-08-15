import { Metadata } from 'next'
import { getArticles } from '@/lib/api'
import IslamInRussia from '@/components/islam/IslamInRussia'

export const revalidate = 60 

export const metadata: Metadata = {
  title: 'Ислам в России | Россия - Исламский мир',
  description: 'Новости и материалы об исламе в России — мечети, религиозные общины, межконфессиональный диалог.',
  alternates: {
    canonical: '/islam-in-russia',
  },
  openGraph: {
    title: 'Ислам в России | Россия - Исламский мир',
    description: 'Новости и материалы об исламе в России.',
    url: '/islam-in-russia',
    type: 'website',
  },
}

export default async function IslamInRussiaPage() {
  let initialData = null
  try {
    initialData = await getArticles({ category: 'islam_in_russia', page: 1 })
  } catch {
  }

  return <IslamInRussia initialData={initialData} />
}