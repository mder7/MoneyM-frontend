// Карточка акционера — те же поля, что отдаёт веб-сервис (toApiView)
export interface Shareholder {
  id: number
  fullName: string
  shortDescription: string | null
  imageUrl: string | null
  videoUrl: string | null
  ownershipShare: number
  preferredShare: number
  likesCount: number
  isMine: number
}
