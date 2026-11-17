import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  selectFeedCard,
  selectRequestsLoading,
  selectShareholdersError,
} from '../../entities/shareholder/model/selectors'
import {
  deleteShareholder,
  getShareholderFeed,
  getShareholderFeedById,
  getShareholdersList,
  likeShareholder,
} from '../../entities/shareholder/model/shareholdersThunks'
import { DEFAULT_IMAGE, DEFAULT_VIDEO, ROUTES } from '../../shared/config/routes'
import './FeedPage.css'

// Страница «Лента»: одна карточка акционера на весь экран
export const FeedPage: FC = () => {
  const { id } = useParams()                       // id карточки из адреса /feed/:id
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const card = useAppSelector(selectFeedCard)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const isLoading = useAppSelector(selectRequestsLoading)
  const error = useAppSelector(selectShareholdersError)
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null)
  const [videoFailedCardId, setVideoFailedCardId] = useState<number | null>(null)
  const preloadedRouteId = useRef<number | null>(null)
  const showMore = card !== null && expandedCardId === card.id
  const videoFailed = card !== null && videoFailedCardId === card.id

  useEffect(() => {
    const cardId = id ? Number(id) : undefined
    if (cardId !== undefined && preloadedRouteId.current === cardId) {
      preloadedRouteId.current = null
      return
    }
    if (cardId === undefined) {
      void dispatch(getShareholderFeed())
      return
    }
    if (!Number.isNaN(cardId)) {
      void dispatch(getShareholderFeedById({ id: cardId, next: false }))
    }
  }, [dispatch, id])

  // «Далее»: GET /feed/{id}?next=true и переход на адрес следующей карточки
  const handleNext = async () => {
    if (!card || isLoading) return
    const result = await dispatch(
      getShareholderFeedById({ id: card.id, next: true }),
    )
    if (getShareholderFeedById.fulfilled.match(result)) {
      if (id !== String(result.payload.id)) {
        preloadedRouteId.current = result.payload.id
      }
      navigate(`${ROUTES.FEED}/${result.payload.id}`)
    }
  }

  const handleLikeShareholder = async () => {
    if (!card || isLoading) return
    const result = await dispatch(likeShareholder(card.id))
    if (likeShareholder.fulfilled.match(result)) {
      await dispatch(getShareholdersList())
    }
  }

  const handleDeleteShareholder = async () => {
    if (!card || card.isMine !== 1 || isLoading) return
    const result = await dispatch(deleteShareholder(card.id))
    if (deleteShareholder.fulfilled.match(result)) {
      await dispatch(getShareholdersList())
      navigate(ROUTES.TILES)
    }
  }

  if (!card) {
    return (
      <div className="feedLoader" role={error ? 'alert' : undefined}>
        {error || null}
      </div>
    )
  }

  return (
    <div className="feedPage">
      {videoFailed ? (
        <img
          className="feedMedia"
          src={card.imageUrl || DEFAULT_IMAGE}
          onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE }}
        />
      ) : (
        <video
          key={card.id}
          className="feedMedia"
          src={card.videoUrl || DEFAULT_VIDEO}
          onError={() => setVideoFailedCardId(card.id)}
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      <div className="feedShares">
        {isAuthenticated ? (
          <Button
            className={`feedLikeButton ${card.isLiked ? 'feedLikeButtonLiked' : ''}`}
            aria-pressed={card.isLiked}
            aria-label="Поставить лайк"
            title="Поставить лайк"
            disabled={isLoading || card.isLiked}
            onClick={handleLikeShareholder}
          >
            ♥
          </Button>
        ) : (
          <span
            className={`feedLikeIcon ${card.isLiked ? 'feedLikeIconLiked' : ''}`}
            aria-hidden="true"
          >
            ♥
          </span>
        )}
        <div className="feedShareValue">{card.likesCount}</div>
        <div className="feedShareLabel">Лайки</div>
        {isAuthenticated && card.isMine === 1 && (
          <Button
            className="feedAction feedDelete"
            variant="light"
            disabled={isLoading}
            onClick={handleDeleteShareholder}
          >
            Удалить
          </Button>
        )}
        <div className="feedShareValue">{card.ownershipShare}%</div>
        <div className="feedShareLabel">Доля</div>
        <div className="feedShareValue">{card.preferredShare}%</div>
        <div className="feedShareLabel">Привилег.</div>
      </div>

      <div className="feedOverlay">
        <div className="feedTitle">{card.fullName}</div>
        {error && <div role="alert">{error}</div>}
        {showMore && <div className="feedDescription">{card.shortDescription || 'Описание отсутствует'}</div>}
        <button
          className="feedMore"
          disabled={isLoading}
          onClick={() => setExpandedCardId(showMore ? null : card.id)}
        >
          {showMore ? 'Скрыть' : 'Больше'}
        </button>
        <Button className="feedNext" variant="light" disabled={isLoading} onClick={handleNext}>
          Далее ↓
        </Button>
      </div>
    </div>
  )
}
