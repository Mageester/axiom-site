import { Outlet, useLocation } from 'react-router-dom'
import { normalizePathname, routes } from '../../config/routes'
import { ButtonLink } from '../ui/Button'
import { SiteFooter } from './SiteFooter'
import { SiteNav } from './SiteNav'

export function PageLayout() {
  const location = useLocation()
  const pathname = normalizePathname(location.pathname)
  const isHomePage = pathname === routes.home
  const isReservationsPage = pathname === routes.reservations
  const showMobileReserveBar = !isHomePage && !isReservationsPage

  return (
    <div className="app-shell">
      <SiteNav />
      <main className="page-main">
        <Outlet />
      </main>
      <SiteFooter />
      {showMobileReserveBar ? (
        <div className="mobile-reserve-bar">
          <ButtonLink fullWidth size="lg" to={routes.reservations}>
            Reserve a table
          </ButtonLink>
        </div>
      ) : null}
    </div>
  )
}
