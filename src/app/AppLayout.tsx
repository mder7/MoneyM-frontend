import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppSelector } from './hooks'
import { selectRequestsLoading } from '../entities/shareholder/model/selectors'
import { LoadingOverlay } from '../shared/ui/LoadingOverlay'
import { TabBar } from '../widgets/TabBar/TabBar'

// Общая оболочка: узкая колонка под экран телефона + нижняя навигация
export const AppLayout: FC = () => {
  const isLoading = useAppSelector(selectRequestsLoading)

  return (
    <div className="appShell" aria-busy={isLoading}>
      <main className="appContent">
        <Outlet />
      </main>
      <TabBar />
      <LoadingOverlay show={isLoading} />
    </div>
  )
}
