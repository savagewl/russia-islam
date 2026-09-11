const API_BASE = 'https://api.rusislworld.ru'

export interface AlbumPhoto {
  id: number
  image: string
  created: string
}

export interface Album {
  id: number
  title: string
  article_slug: string | null
  created: string
  photos: AlbumPhoto[]
}

export interface ArticlePreview {
  id: number
  title: string
  slug: string
  short_description: string
  category: string
  category_display: string
  location: string
  preview_image_url: string
  expert: number
  expert_name: string
  created: string
}

export interface ArticleDetail extends ArticlePreview {
  description: string
  source: string
  preview_image_source: string
  expert_detail: {
    id: number
    name: string
    description: string
    preview_image_url: string
    articles_count: number
    created: string
  }
  albums: Album[]
  videos: { id: number; video_url: string; created: string }[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Expert {
  id: number
  name: string
  description: string
  preview_image_url: string
  articles_count: number
  created: string
}

export interface ExpertDetail extends Expert {
  articles: ArticlePreview[]
}

export async function getArticles(params?: {
  page?: number
  category?: string
  search?: string
  expert?: number
  created_from?: string
  created_to?: string
  lang?: string
  has_photos?: boolean
  has_videos?: boolean
}): Promise<PaginatedResponse<ArticlePreview>> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.category) query.set('category', params.category)
  if (params?.search) query.set('search', params.search)
  if (params?.expert) query.set('expert', String(params.expert))
  if (params?.created_from) query.set('created_from', params.created_from)
  if (params?.created_to) query.set('created_to', params.created_to)
  if (params?.lang && params.lang !== 'ru') query.set('lang', params.lang)
  if (params?.has_photos !== undefined) query.set('has_photos', String(params.has_photos))
  if (params?.has_videos !== undefined) query.set('has_videos', String(params.has_videos))

  const res = await fetch(`${API_BASE}/articles/?${query.toString()}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export async function findArticleById(id: number, lang?: string): Promise<ArticleDetail | null> {
  let page = 1
  while (true) {
    const query = new URLSearchParams({ page: String(page), page_size: '100' })
    if (lang && lang !== 'ru') query.set('lang', lang)
    const res = await fetch(`${API_BASE}/articles/?${query}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const list: PaginatedResponse<ArticlePreview> = await res.json()
    const found = list.results.find(a => a.id === id)
    if (found) return getArticleBySlug(found.slug, lang)
    if (!list.next) return null
    page++
  }
}

export async function getArticleBySlug(slug: string, lang?: string): Promise<ArticleDetail> {
  const query = new URLSearchParams()
  if (lang && lang !== 'ru') query.set('lang', lang)

  const qs = query.toString()
  const url = qs
    ? `${API_BASE}/articles/${slug}/?${qs}`
    : `${API_BASE}/articles/${slug}/`

  const res = await fetch(url, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Failed to fetch article: ${slug}`)
  return res.json()
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/articles/slugs/`, { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error('Failed to fetch article slugs')
  return res.json()
}


//  lang
export async function getExperts(params?: {
  page?: number
  search?: string
  lang?: string
}): Promise<PaginatedResponse<Expert>> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.search) query.set('search', params.search)
  if (params?.lang && params.lang !== 'ru') query.set('lang', params.lang)

  const res = await fetch(`${API_BASE}/experts/?${query.toString()}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch experts')
  return res.json()
}

// параметр lang
export async function getExpertById(id: number, lang?: string): Promise<ExpertDetail> {
  const query = new URLSearchParams()
  if (lang && lang !== 'ru') query.set('lang', lang)

  const qs = query.toString()
  const url = qs
    ? `${API_BASE}/experts/${id}/?${qs}`
    : `${API_BASE}/experts/${id}/`

  const res = await fetch(url, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Failed to fetch expert: ${id}`)
  return res.json()
}


export async function getPhotos(params?: {
  page?: number
  page_size?: number
  created_from?: string
  created_to?: string
}): Promise<PaginatedResponse<{ id: number; image_url: string; created: string }>> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.page_size) query.set('page_size', String(params.page_size))
  if (params?.created_from) query.set('created_from', params.created_from)
  if (params?.created_to) query.set('created_to', params.created_to)

  const res = await fetch(`${API_BASE}/articles/photos/?${query.toString()}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch photos')
  return res.json()
}

export async function getVideos(params?: {
  page?: number
  page_size?: number
  created_from?: string
  created_to?: string
}): Promise<PaginatedResponse<{ id: number; video_url: string; created: string }>> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.page_size) query.set('page_size', String(params.page_size))
  if (params?.created_from) query.set('created_from', params.created_from)
  if (params?.created_to) query.set('created_to', params.created_to)

  const res = await fetch(`${API_BASE}/articles/videos/?${query.toString()}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch videos')
  return res.json()
}



export async function getAlbums(params?: {
  page?: number
  page_size?: number
  article?: number
  lang?: string
  created_from?: string
  created_to?: string
}): Promise<PaginatedResponse<Album>> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.page_size) query.set('page_size', String(params.page_size))
  if (params?.article) query.set('article', String(params.article))
  if (params?.lang && params.lang !== 'ru') query.set('lang', params.lang)
  if (params?.created_from) query.set('created_from', params.created_from)
  if (params?.created_to) query.set('created_to', params.created_to)

  const res = await fetch(`${API_BASE}/album/?${query.toString()}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch albums')
  return res.json()
}

export async function getAlbumById(id: number): Promise<Album> {
  const res = await fetch(`${API_BASE}/album/${id}/`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Failed to fetch album: ${id}`)
  return res.json()
}

export interface Broadcast {
  id: number
  title: string
  video_url: string
  event_date: string
  image: string | null
  created: string
}

export async function getBroadcast(lang?: string): Promise<Broadcast | null> {
  try {
    const query = new URLSearchParams()
    if (lang && lang !== 'ru') query.set('lang', lang)
    const qs = query.toString()
    const url = qs ? `${API_BASE}/broadcast/current/?${qs}` : `${API_BASE}/broadcast/current/`
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}


export async function getBroadcasts(params?: {
  page?: number
  page_size?: number
  event_date_from?: string
  event_date_to?: string
  lang?: string
}): Promise<PaginatedResponse<Broadcast>> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.page_size) query.set('page_size', String(params.page_size))
  if (params?.event_date_from) query.set('event_date_from', params.event_date_from)
  if (params?.event_date_to) query.set('event_date_to', params.event_date_to)
  if (params?.lang && params.lang !== 'ru') query.set('lang', params.lang)

  const res = await fetch(`${API_BASE}/broadcast/all/?${query.toString()}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch broadcasts')
  return res.json()
}

export interface Quote {
  id: number
  image: string
  name: string
  short_description: string
  text: string
  created: string
}

export async function getQuotes(params?: {
  lang?: string
  page?: number
  page_size?: number
}): Promise<PaginatedResponse<Quote>> {
  const query = new URLSearchParams()
  if (params?.lang && params.lang !== 'ru') query.set('lang', params.lang)
  if (params?.page) query.set('page', String(params.page))
  if (params?.page_size) query.set('page_size', String(params.page_size))

  const res = await fetch(`${API_BASE}/quotes?${query.toString()}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch quotes')
  return res.json()
}

export async function subscribeEmail(email: string): Promise<{ id: number; email: string; created: string }> {
  const res = await fetch(`${API_BASE}/emails/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Failed to subscribe')
  return res.json()
}


export function formatDate(dateString: string, lang?: string): string {
  const date = new Date(dateString)
  const locale = lang === 'ar' ? 'ar-SA-u-nu-latn' : lang === 'en' ? 'en-US' : 'ru-RU'
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

export const CATEGORY_LABELS: Record<string, string> = {
  key_projects: 'Ключевые проекты',
  islam_russia: 'Ислам в России',
  islam_in_russia: 'Ислам в России',
  oic_news: 'Новости',
  group_news: 'Новости группы',
  opportunities: 'Возможности',
  events: 'Анонсы',
  scientific_articles: 'Научные статьи',
  founders_and_executives: 'Основатели и руководители',
}

type Lang3 = 'ru' | 'en' | 'ar'
const CATEGORY_I18N: Record<string, Record<Lang3, string>> = {
  group_news:              { ru: 'Новости группы',            en: 'Group News',        ar: 'أخبار المجموعة' },
  key_projects:            { ru: 'Ключевые проекты',          en: 'Key Projects',      ar: 'مشاريع رئيسية' },
  opportunities:           { ru: 'Возможности',               en: 'Opportunities',     ar: 'إمكانيات' },
  events:                  { ru: 'Анонсы',                    en: 'Announcements',     ar: 'إعلانات' },
  oic_news:                { ru: 'Новости',                   en: 'News',              ar: 'أخبار' },
  islam_russia:            { ru: 'Ислам в России',            en: 'Islam in Russia',   ar: 'الإسلام في روسيا' },
  islam_in_russia:         { ru: 'Ислам в России',            en: 'Islam in Russia',   ar: 'الإسلام في روسيا' },
  scientific_articles:     { ru: 'Научные статьи',            en: 'Articles',          ar: 'مقالات' },
  founders_and_executives: { ru: 'Основатели и руководители', en: 'Founders',          ar: 'المؤسسون والرؤساء' },
}

export function getCategoryLabel(category: string, lang: string, fallback?: string): string {
  const entry = CATEGORY_I18N[category]
  if (!entry) return fallback || category
  const l = (['ru', 'en', 'ar'].includes(lang) ? lang : 'ru') as Lang3
  return entry[l]
}