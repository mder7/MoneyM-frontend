import type { FC } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { TilesPage } from '../pages/TilesPage/TilesPage'
import { FeedPage } from '../pages/FeedPage/FeedPage'
import { ROUTES } from '../shared/config/routes'

export const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to={ROUTES.FEED} replace />} />
        <Route path={ROUTES.TILES} element={<TilesPage />} />
        <Route path={ROUTES.FEED} element={<FeedPage />} />
        <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
