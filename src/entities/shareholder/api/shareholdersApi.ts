import type { Shareholder } from '../model/types'
import { SHAREHOLDERS_MOCK } from '../model/mock'
import { toProxyUrl } from '../../../shared/config/routes'

// фото и видео — через прокси /dividends
const withProxyMedia = (item: Shareholder): Shareholder => ({
  ...item,
  imageUrl: toProxyUrl(item.imageUrl),
  videoUrl: toProxyUrl(item.videoUrl),
})

// Запросы идут на /api — Vite проксирует их на веб-сервис NestJS (vite.config.ts).
// Если веб-сервис не отвечает, данные берутся из mock-коллекции.

// GET /api/shareholders?minShare=… — плитка опубликованных акционеров
export const getShareholders = async (minShare?: number): Promise<Shareholder[]> => {
  const query = minShare ? `?minShare=${minShare}` : ''
  try {
    const response = await fetch(`/api/shareholders${query}`)
    if (!response.ok) throw new Error(String(response.status))
    return ((await response.json()) as Shareholder[]).map(withProxyMedia)
  } catch {
    return SHAREHOLDERS_MOCK.filter((item) => !minShare || item.ownershipShare >= minShare)
  }
}

// GET /api/shareholders/feed — первая карточка ленты
// GET /api/shareholders/feed/{id}            — карточка по id
// GET /api/shareholders/feed/{id}?next=true  — следующая карточка после id
export const getFeedCard = async (id?: number, next = false): Promise<Shareholder | null> => {
  const path = id ? `/api/shareholders/feed/${id}${next ? '?next=true' : ''}` : '/api/shareholders/feed'
  try {
    const response = await fetch(path)
    if (!response.ok) throw new Error(String(response.status))
    return withProxyMedia((await response.json()) as Shareholder)
  } catch {
    return getMockFeedCard(id, next)
  }
}

const getMockFeedCard = (id?: number, next = false): Shareholder | null => {
  if (!SHAREHOLDERS_MOCK.length) return null
  if (!id) return SHAREHOLDERS_MOCK[0]
  const index = SHAREHOLDERS_MOCK.findIndex((item) => item.id === id)
  if (index === -1) return SHAREHOLDERS_MOCK[0]
  if (!next) return SHAREHOLDERS_MOCK[index]
  // по кругу, как в веб-сервисе
  return SHAREHOLDERS_MOCK[(index + 1) % SHAREHOLDERS_MOCK.length]
}
