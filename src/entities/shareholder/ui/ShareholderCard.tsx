import type { FC } from 'react'
import { Button, Card } from 'react-bootstrap'
import { DEFAULT_IMAGE } from '../../../shared/config/routes'
import './ShareholderCard.css'

interface Props {
  fullName: string
  imageUrl: string | null
  ownershipShare: number
  likesCount: number
  isLiked: boolean
  isMine: number
  isAuthenticated: boolean
  loading: boolean
  onClick: () => void
  onLike: () => void
  onDelete: () => void
}

// Карточка акционера для плитки. Если фото нет — изображение по умолчанию.
export const ShareholderCard: FC<Props> = ({
  fullName,
  imageUrl,
  ownershipShare,
  likesCount,
  isLiked,
  isMine,
  isAuthenticated,
  loading,
  onClick,
  onLike,
  onDelete,
}) => (
  <Card
    className="shCard"
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') onClick()
    }}
  >
    <Card.Img
      className="shCardImage"
      variant="top"
      src={imageUrl || DEFAULT_IMAGE}
      onError={(event) => {
        event.currentTarget.src = DEFAULT_IMAGE
      }}
    />
    <Card.Body className="shCardBody">
      <Card.Title className="shCardTitle">{fullName}</Card.Title>
      <div className="shCardMeta">
        <span>{ownershipShare}%</span>
        <span className={`shCardLikes ${isLiked ? 'shCardLiked' : ''}`}>
          ♥ {likesCount}
        </span>
      </div>
      {isAuthenticated && (
        <div className="shCardActions">
          <Button
            className="shCardAction"
            variant="link"
            disabled={loading || isLiked}
            onClick={(event) => {
              event.stopPropagation()
              onLike()
            }}
          >
            {isLiked ? 'Лайк поставлен' : 'Нравится'}
          </Button>
          {isMine === 1 && (
            <Button
              className="shCardAction shCardDelete"
              variant="link"
              disabled={loading}
              onClick={(event) => {
                event.stopPropagation()
                onDelete()
              }}
            >
              Удалить
            </Button>
          )}
        </div>
      )}
    </Card.Body>
  </Card>
)
