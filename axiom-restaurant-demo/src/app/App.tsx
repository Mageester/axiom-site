import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { routes } from '../config/routes'
import { AboutPage } from '../pages/AboutPage'
import { HomePage } from '../pages/HomePage'
import { MenuPage } from '../pages/MenuPage'
import { ReservationsPage } from '../pages/ReservationsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route element={<HomePage />} path={routes.home} />
          <Route element={<MenuPage />} path={routes.menu} />
          <Route element={<AboutPage />} path={routes.about} />
          <Route element={<ReservationsPage />} path={routes.reservations} />
          <Route element={<Navigate replace to={routes.home} />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
