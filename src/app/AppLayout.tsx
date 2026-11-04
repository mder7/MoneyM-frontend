import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { TabBar } from '../widgets/TabBar/TabBar'

// Общая оболочка: узкая колонка под экран телефона + нижняя навигация
export const AppLayout: FC = () => (
  <div className="appShell">
    <main className="appContent">
      <Outlet />
    </main>
    <TabBar />
  </div>
)
