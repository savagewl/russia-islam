export function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  if (typeof document !== 'undefined') {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }
  return html
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*(>|$)/g, '')
    .trim()
}
