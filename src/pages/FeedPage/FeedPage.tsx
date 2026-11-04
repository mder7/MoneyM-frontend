import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import type { Shareholder } from '../../entities/shareholder/model/types'
import { getFeedCard } from '../../entities/shareholder/api/shareholdersApi'
import { DEFAULT_IMAGE, DEFAULT_VIDEO, ROUTES } from '../../shared/config/routes'
import './FeedPage.css'

// Страница «Лента»: одна карточка акционера на весь экран
export const FeedPage: FC = () => {
  const { id } = useParams()                       // id карточки из адреса /feed/:id
  const navigate = useNavigate()
  const [card, setCard] = useState<Shareholder | null>(null)
  const [showMore, setShowMore] = useState(false)  // раскрыто ли описание («Больше»)
  const [videoFailed, setVideoFailed] = useState(false)

  // При открытии страницы или смене id в адресе загружаем карточку.
  // Если карточка с этим id уже получена кнопкой «Далее», повторный GET не выполняем.
  useEffect(() => {
    const cardId = id ? Number(id) : undefined
    if (card && cardId === card.id) return
    getFeedCard(cardId).then((data) => {
      setCard(data)
      setVideoFailed(false)
      setShowMore(false)
    })
  }, [id])

  // «Далее»: GET /feed/{id}?next=true и переход на адрес следующей карточки
  const handleNext = () => {
    if (!card) return
    getFeedCard(card.id, true).then((next) => {
      if (!next) return
      setCard(next)
      setVideoFailed(false)
      setShowMore(false)
      navigate(`${ROUTES.FEED}/${next.id}`)
    })
  }

  if (!card) {
    return (
      <div className="feedLoader">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="feedPage">
      {videoFailed ? (
        <img
          className="feedMedia"
          src={card.imageUrl || DEFAULT_IMAGE}
          onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE }}
        />
      ) : (
        <video
          key={card.id}
          className="feedMedia"
          src={card.videoUrl || DEFAULT_VIDEO}
          onError={() => setVideoFailed(true)}
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      <div className="feedShares">
        <div className="feedShareValue">♥ {card.likesCount}</div>
        <div className="feedShareLabel">Лайки</div>
        <div className="feedShareValue">{card.ownershipShare}%</div>
        <div className="feedShareLabel">Доля</div>
        <div className="feedShareValue">{card.preferredShare}%</div>
        <div className="feedShareLabel">Привилег.</div>
      </div>

      <div className="feedOverlay">
        <div className="feedTitle">{card.fullName}</div>
        {showMore && <div className="feedDescription">{card.shortDescription || 'Описание отсутствует'}</div>}
        <button className="feedMore" onClick={() => setShowMore((value) => !value)}>
          {showMore ? 'Скрыть' : 'Больше'}
        </button>
        <Button className="feedNext" variant="light" onClick={handleNext}>
          Далее ↓
        </Button>
      </div>
    </div>
  )
}
