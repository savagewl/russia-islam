import { Metadata } from 'next'
import PhotoVideo from '@/components/photo-video/PhotoVideo'

export const metadata: Metadata = {
  title: 'Фото и видео | Россия - Исламский мир',
  description: 'Фотографии и видеоматериалы',
}

export default function PhotoVideoPage() {
  return <PhotoVideo />
}