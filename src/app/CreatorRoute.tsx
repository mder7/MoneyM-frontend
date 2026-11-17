import type { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from './hooks'
import { ROUTES } from '../shared/config/routes'

export const CreatorRoute: FC<PropsWithChildren> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />
}
