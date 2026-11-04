export const ROUTES = {
  FEED: '/feed',
  ADD: '/add',
  TILES: '/tiles',
  LOGIN: '/login',
}

// Изображение и видео по умолчанию лежат в папке public самого проекта
export const DEFAULT_IMAGE = '/DefaultImage.jpg'
export const DEFAULT_VIDEO = '/DefaultVideo.mp4'

// Ссылку на объект MinIO (http://localhost:9000/dividends/...) превращаем в относительную
// (/dividends/...), чтобы файл шёл через прокси сервера фронтенда, а не напрямую в S3
export const toProxyUrl = (url: string | null): string | null =>
  url ? url.replace(/^https?:\/\/[^/]+(?=\/dividends\/)/, '') : null
