import type { Shareholder } from './types'

// Mock-коллекция: используется, когда веб-сервис недоступен.
// imageUrl и videoUrl пустые — показываются изображение и видео по умолчанию.
export const SHAREHOLDERS_MOCK: Shareholder[] = [
  {
    id: 1,
    fullName: 'Александр Чачава',
    shortDescription: 'Крупнейший индивидуальный акционер компании',
    imageUrl: null,
    videoUrl: null,
    ownershipShare: 19.69,
    preferredShare: 10,
    likesCount: 3,
    isLiked: false,
    isMine: 0,
  },
  {
    id: 2,
    fullName: 'Команда менеджеров (FMP)',
    shortDescription: 'Менеджмент компании',
    imageUrl: null,
    videoUrl: null,
    ownershipShare: 16.3,
    preferredShare: 4,
    likesCount: 3,
    isLiked: false,
    isMine: 0,
  },
  {
    id: 3,
    fullName: 'Каталитик Пипл',
    shortDescription: 'Институциональный инвестор',
    imageUrl: null,
    videoUrl: null,
    ownershipShare: 9.89,
    preferredShare: 12,
    likesCount: 2,
    isLiked: false,
    isMine: 0,
  },
  {
    id: 4,
    fullName: 'Администраторы программы мотивации',
    shortDescription: 'Программа мотивации сотрудников',
    imageUrl: null,
    videoUrl: null,
    ownershipShare: 3.62,
    preferredShare: 0,
    likesCount: 2,
    isLiked: false,
    isMine: 0,
  },
]
