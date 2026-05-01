/**
 * Поддерживает:
 * - Rutube:  https://rutube.ru/video/ABC123/  →  embed iframe
 * - YouTube: https://youtube.com/watch?v=ID   →  embed iframe
 * - YouTube: https://youtu.be/ID              →  embed iframe
 * - VK Video: https://vk.com/video...         →  embed iframe
 * - Прямые ссылки на файлы (.mp4 и т.д.)     →  <video> тег
 * - Всё остальное                             →  redirect (открыть ссылку напрямую)
 */
export function getVideoEmbed(
  url: string
):
  | { type: 'iframe'; src: string }
  | { type: 'video'; src: string }
  | { type: 'redirect'; src: string }
  | null
{
  if (!url) return null

  const rutubeMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)\/?/)
  if (rutubeMatch) {
    return { type: 'iframe', src: `https://rutube.ru/play/embed/${rutubeMatch[1]}/` }
  }

  if (url.includes('rutube.ru/play/embed/')) {
    return { type: 'iframe', src: url }
  }

  const ytWatchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (ytWatchMatch) {
    return { type: 'iframe', src: `https://www.youtube.com/embed/${ytWatchMatch[1]}` }
  }

  if (url.includes('youtube.com/embed/')) {
    return { type: 'iframe', src: url }
  }

  const vkMatch = url.match(/vk\.com\/video(-?\d+_\d+)/)
  if (vkMatch) {
    const [oid, id] = vkMatch[1].split('_')
    return { type: 'iframe', src: `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2` }
  }

  if (url.includes('vk.com/video_ext.php')) {
    return { type: 'iframe', src: url }
  }

  if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
    return { type: 'video', src: url }
  }

  return { type: 'redirect', src: url }
}