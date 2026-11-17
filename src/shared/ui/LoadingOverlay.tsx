import type { FC } from 'react'
import { Spinner } from 'react-bootstrap'

interface Props {
  show: boolean
}

export const LoadingOverlay: FC<Props> = ({ show }) => {
  if (!show) return null

  return (
    <div className="loadingOverlay" role="status" aria-live="polite">
      <Spinner animation="border" />
      <span className="visually-hidden">Загрузка</span>
    </div>
  )
}
