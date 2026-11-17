import type { FC } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  selectMinShare,
  selectRequestsLoading,
  selectShareholders,
  selectShareholdersError,
} from '../../entities/shareholder/model/selectors'
import { setMinShare } from '../../entities/shareholder/model/shareholdersSlice'
import {
  deleteShareholder,
  getShareholdersList,
  likeShareholder,
} from '../../entities/shareholder/model/shareholdersThunks'
import { ShareholderCard } from '../../entities/shareholder/ui/ShareholderCard'
import { ShareFilter } from '../../features/ShareFilter/ShareFilter'
import { ROUTES } from '../../shared/config/routes'
import './TilesPage.css'

// Страница «Плитка»: список опубликованных акционеров с фильтром по доле владения
export const TilesPage: FC = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const minShare = useAppSelector(selectMinShare)
  const shareholders = useAppSelector(selectShareholders)
  const isLoading = useAppSelector(selectRequestsLoading)
  const error = useAppSelector(selectShareholdersError)
  const navigate = useNavigate()

  // при первом рендере загружаем всю плитку
  useEffect(() => {
    void dispatch(getShareholdersList())
  }, [dispatch, isAuthenticated])

  const handleLikeShareholder = async (shareholderId: number) => {
    const result = await dispatch(likeShareholder(shareholderId))
    if (likeShareholder.fulfilled.match(result)) {
      await dispatch(getShareholdersList())
    }
  }

  const handleDeleteShareholder = async (shareholderId: number) => {
    const result = await dispatch(deleteShareholder(shareholderId))
    if (deleteShareholder.fulfilled.match(result)) {
      await dispatch(getShareholdersList())
    }
  }

  return (
    <div className="page">
      <h1 className="pageTitle">Акционеры</h1>

      <ShareFilter
        value={minShare}
        setValue={(value) => dispatch(setMinShare(value))}
        onSubmit={() => void dispatch(getShareholdersList())}
        loading={isLoading}
      />

      {error && <p className="pageError" role="alert">{error}</p>}

      {!isLoading && !shareholders.length && !error && (
        <p className="pageEmpty">Акционеры не найдены</p>
      )}

      {!isLoading && (
        <div className="tilesGrid">
          {shareholders.map((item) => (
            <ShareholderCard
              key={item.id}
              fullName={item.fullName}
              imageUrl={item.imageUrl}
              ownershipShare={item.ownershipShare}
              likesCount={item.likesCount}
              isLiked={item.isLiked}
              isMine={item.isMine}
              isAuthenticated={isAuthenticated}
              loading={isLoading}
              onLike={() => void handleLikeShareholder(item.id)}
              onDelete={() => void handleDeleteShareholder(item.id)}
              onClick={() => {
                if (!isLoading) navigate(`${ROUTES.FEED}/${item.id}`)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
