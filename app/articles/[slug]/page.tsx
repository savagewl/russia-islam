// app/articles/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/api'
import ArticleTabs from './ArticleTabs'
import ArticleMeta from './ArticleMeta'
import BackButton from './BackButton'
import ScientificArticlesSection from '@/components/scientific-section/ScientificArticlesSection'
import '../../../styles/scientificArticle.css'
import '../../../styles/islamInRussia.css'
import '../../../styles/newsSection.css'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const article = await getArticleBySlug(slug)

    const title = article.title
    const description = article.short_description || article.description?.slice(0, 160)
    const imageUrl = article.preview_image_url || undefined

    return {
      title,
      description,
      alternates: {
        canonical: `/articles/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `/articles/${slug}`,
        type: 'article',
        publishedTime: article.created,
        authors: article.expert_name ? [article.expert_name] : undefined,
        section: article.category_display || undefined,
        images: imageUrl
          ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    }
  } catch {
    return { title: 'Статья | Россия - Исламский мир' }
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params

  let article
  try {
    article = await getArticleBySlug(slug)
  } catch {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.short_description || article.description?.slice(0, 300),
    image: article.preview_image_url || undefined,
    datePublished: article.created,
    dateModified: article.created,
    url: `https://rusislworld.ru/articles/${slug}`,

    ...(article.expert_detail
      ? {
          author: {
            '@type': 'Person',
            name: article.expert_detail.name,
            url: `https://rusislworld.ru/experts/${article.expert_detail.id}`,
            ...(article.expert_detail.preview_image_url
              ? { image: article.expert_detail.preview_image_url }
              : {}),
          },
        }
      : {
          author: {
            '@type': 'Organization',
            name: 'Россия — Исламский мир',
          },
        }),

    publisher: {
      '@type': 'Organization',
      name: 'Группа стратегического видения «Россия — Исламский мир»',
      url: 'https://rusislworld.ru',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rusislworld.ru/images/russia.jpg',
      },
    },

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rusislworld.ru/articles/${slug}`,
    },
  }

  return (
    <div className="scientific-article-page">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="hero-section container">

        <div className="article-back-row">
          <BackButton />
        </div>

        <ArticleMeta created={article.created} location={article.location} slug={slug} />

        {article.preview_image_url && (
          <div style={{
            width: '100%',
            maxWidth: 860,
            aspectRatio: '16/9',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 32,
            borderRadius: 4,
            background: '#f0f0f0',
          }}>
            <Image
              src={article.preview_image_url}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 860px"
              priority
            />
          </div>
        )}

        <ArticleTabs article={article} slug={slug} />

      </div>

      <ScientificArticlesSection titleKey="see_also" showButton={false} excludeSlug={slug} />
    </div>
  )
}