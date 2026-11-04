import type { FC } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '../../shared/config/routes'
import './TabBar.css'

// Нижняя навигационная панель из 4 пунктов.
// Доступны только «Лента» и «Плитка», «Добавить» и «Вход» — неактивны.
export const TabBar: FC = () => {
  const location = useLocation()
  const isFeed = location.pathname.startsWith(ROUTES.FEED)
  const isTiles = location.pathname.startsWith(ROUTES.TILES)

  return (
    <Navbar fixed="bottom" className="tabBar">
      <Nav className="tabBarNav">
        <Nav.Link as={NavLink} to={ROUTES.FEED} className={`tabBarItem ${isFeed ? 'tabBarItemActive' : ''}`}>
          <span className="tabBarIcon">▯</span>
          Лента
        </Nav.Link>
        <Nav.Link disabled className="tabBarItem">
          <span className="tabBarIcon">＋</span>
          Добавить
        </Nav.Link>
        <Nav.Link as={NavLink} to={ROUTES.TILES} className={`tabBarItem ${isTiles ? 'tabBarItemActive' : ''}`}>
          <span className="tabBarIcon">▦</span>
          Плитка
        </Nav.Link>
        <Nav.Link disabled className="tabBarItem">
          <span className="tabBarIcon">→</span>
          Вход
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}
