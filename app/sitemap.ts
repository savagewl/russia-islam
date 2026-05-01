
import { MetadataRoute } from 'next'
import { getAllArticleSlugs, getExperts, CATEGORY_LABELS } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rusislworld.ru'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-group`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/islam-in-russia`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/photo-video`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const categoryPages: MetadataRoute.Sitemap = Object.keys(CATEGORY_LABELS)
    .filter(cat => !['founders_and_executives'].includes(cat)) 
    .map(category => ({
      url: `${baseUrl}/articles?category=${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  let articlePages: MetadataRoute.Sitemap = []
  try {
    const slugs = await getAllArticleSlugs()
    articlePages = slugs.map((slug) => ({
      url: `${baseUrl}/articles/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch {
    console.error('Failed to fetch article slugs for sitemap')
  }

  let expertPages: MetadataRoute.Sitemap = []
  try {
    const experts = await getExperts()
    expertPages = experts.results.map((expert) => ({
      url: `${baseUrl}/experts/${expert.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    console.error('Failed to fetch experts for sitemap')
  }

  return [...staticPages, ...categoryPages, ...articlePages, ...expertPages]
}