import { v4 as uuidv4 } from 'uuid'

export function generateId(): string {
  return uuidv4()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length).replace(/\s+\S*$/, '') + '...'
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function paginate(page: number, limit: number) {
  const p = Math.max(1, page)
  const l = Math.min(Math.max(1, limit), 100)
  return {
    skip: (p - 1) * l,
    take: l,
    page: p,
    limit: l,
  }
}
