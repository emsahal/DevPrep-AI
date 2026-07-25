export interface PaginationParams {
  page?: number
  limit?: number
  cursor?: string
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    nextCursor?: string
  }
}

export interface NormalizedPagination {
  page: number
  limit: number
  cursor: string
}

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 100

export function normalizePagination(params: PaginationParams): NormalizedPagination {
  return {
    page: Math.max(1, params.page ?? DEFAULT_PAGE),
    limit: Math.min(MAX_LIMIT, Math.max(1, params.limit ?? DEFAULT_LIMIT)),
    cursor: params.cursor ?? '',
  }
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  params: NormalizedPagination
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / params.limit)
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  }
}

export function buildCursor<T>(item: T, cursorField: keyof T): string {
  return Buffer.from(String(item[cursorField])).toString('base64')
}

export function parseCursor(cursor: string): string {
  try {
    return Buffer.from(cursor, 'base64').toString('utf-8')
  } catch {
    return ''
  }
}

export function getSkipTake(params: Required<PaginationParams>): { skip: number; take: number } {
  return {
    skip: (params.page - 1) * params.limit,
    take: params.limit + 1, // take one extra to check if there's a next page
  }
}

export function applyCursorPagination<T>(
  items: T[],
  cursor: string,
  cursorField: keyof T,
  limit: number
): { data: T[]; nextCursor?: string } {
  if (!cursor) {
    const data = items.slice(0, limit + 1)
    const nextCursor = data.length > limit ? buildCursor(data[limit], cursorField) : undefined
    return { data: data.slice(0, limit), nextCursor }
  }

  const cursorValue = parseCursor(cursor)
  const startIndex = items.findIndex(item => String(item[cursorField]) > cursorValue)
  const start = startIndex === -1 ? items.length : startIndex
  const data = items.slice(start, start + limit + 1)
  const nextCursor = data.length > limit ? buildCursor(data[limit], cursorField) : undefined

  return { data: data.slice(0, limit), nextCursor }
}