import type { FC } from 'react'
import { useState } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import axios from 'axios'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  clearAuth,
  finishAuthRequest,
  startAuthRequest,
} from '../../entities/auth/model/authSlice'
import { authAxios } from '../../shared/api/authAxios'
import { ROUTES } from '../../shared/config/routes'
import './TabBar.css'

// Нижняя навигационная панель из 4 пунктов.
export const TabBar: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const isFeed = location.pathname.startsWith(ROUTES.FEED)
  const isTiles = location.pathname.startsWith(ROUTES.TILES)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    setLogoutError(null)
    dispatch(startAuthRequest())
    try {
      await authAxios.post('/users/logout')
      dispatch(clearAuth())
      navigate(ROUTES.TILES)
    } catch (error) {
      if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
        const message = error.response?.data?.message
        setLogoutError(
          Array.isArray(message)
            ? message.join(', ')
            : message ?? 'Не удалось выйти',
        )
      } else {
        setLogoutError(error instanceof Error ? error.message : 'Не удалось выйти')
      }
    } finally {
      dispatch(finishAuthRequest())
      setIsLoggingOut(false)
    }
  }

  return (
    <Navbar fixed="bottom" className="tabBar">
      {logoutError && <div className="tabBarError" role="alert">{logoutError}</div>}
      <Nav className="tabBarNav">
        <Nav.Link as={NavLink} to={ROUTES.FEED} className={`tabBarItem ${isFeed ? 'tabBarItemActive' : ''}`}>
          <span className="tabBarIcon">▯</span>
          Лента
        </Nav.Link>
        {isAuthenticated ? (
          <Nav.Link
            as={NavLink}
            to={ROUTES.ADD}
            className={`tabBarItem ${location.pathname === ROUTES.ADD ? 'tabBarItemActive' : ''}`}
          >
            <span className="tabBarIcon">＋</span>
            Добавить
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="tabBarItem">
            <span className="tabBarIcon">＋</span>
            Добавить
          </Nav.Link>
        )}
        <Nav.Link as={NavLink} to={ROUTES.TILES} className={`tabBarItem ${isTiles ? 'tabBarItemActive' : ''}`}>
          <span className="tabBarIcon">▦</span>
          Плитка
        </Nav.Link>
        {isAuthenticated ? (
          <Nav.Link
            as="button"
            type="button"
            disabled={isLoggingOut}
            className="tabBarItem"
            onClick={handleLogout}
          >
            <span className="tabBarIcon">→</span>
            Выход
          </Nav.Link>
        ) : (
          <Nav.Link
            as={NavLink}
            to={ROUTES.LOGIN}
            className={`tabBarItem ${location.pathname === ROUTES.LOGIN ? 'tabBarItemActive' : ''}`}
          >
            <span className="tabBarIcon">→</span>
            Вход
          </Nav.Link>
        )}
      </Nav>
    </Navbar>
  )
}
