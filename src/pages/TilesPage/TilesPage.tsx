import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import type { Shareholder } from '../../entities/shareholder/model/types'
import { getShareholders } from '../../entities/shareholder/api/shareholdersApi'
import { ShareholderCard } from '../../entities/shareholder/ui/ShareholderCard'
import { ShareFilter } from '../../features/ShareFilter/ShareFilter'
import { ROUTES } from '../../shared/config/routes'
import './TilesPage.css'

// Страница «Плитка»: список опубликованных акционеров с фильтром по доле владения
export const TilesPage: FC = () => {
  const [minShare, setMinShare] = useState(0)                 // значение фильтра
  const [shareholders, setShareholders] = useState<Shareholder[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const loadShareholders = (share?: number) => {
    setLoading(true)
    getShareholders(share).then((data) => {
      setShareholders(data)
      setLoading(false)
    })
  }

  // при первом рендере загружаем всю плитку
  useEffect(() => {
    loadShareholders()
  }, [])

  return (
    <div className="page">
      <h1 className="pageTitle">Акционеры</h1>

      <ShareFilter
        value={minShare}
        setValue={setMinShare}
        onSubmit={() => loadShareholders(minShare)}
        loading={loading}
      />

      {loading && (
        <div className="pageLoader">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && !shareholders.length && <p className="pageEmpty">Акционеры не найдены</p>}

      {!loading && (
        <div className="tilesGrid">
          {shareholders.map((item) => (
            <ShareholderCard
              key={item.id}
              fullName={item.fullName}
              imageUrl={item.imageUrl}
              ownershipShare={item.ownershipShare}
              likesCount={item.likesCount}
              onClick={() => navigate(`${ROUTES.FEED}/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
