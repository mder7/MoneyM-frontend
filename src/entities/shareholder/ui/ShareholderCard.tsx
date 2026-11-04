import type { FC } from 'react'
import { Card } from 'react-bootstrap'
import { DEFAULT_IMAGE } from '../../../shared/config/routes'
import './ShareholderCard.css'

interface Props {
  fullName: string
  imageUrl: string | null
  ownershipShare: number
  likesCount: number
  onClick: () => void
}

// Карточка акционера для плитки. Если фото нет — изображение по умолчанию.
export const ShareholderCard: FC<Props> = ({ fullName, imageUrl, ownershipShare, likesCount, onClick }) => (
  <Card className="shCard" onClick={onClick}>
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
        <span className="shCardLikes">♥ {likesCount}</span>
      </div>
    </Card.Body>
  </Card>
)
