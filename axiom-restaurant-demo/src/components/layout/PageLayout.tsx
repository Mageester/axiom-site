import { Outlet } from 'react-router-dom'
import { routes } from '../../config/routes'
import { ButtonLink } from '../ui/Button'
import { SiteFooter } from './SiteFooter'
import { SiteNav } from './SiteNav'

export function PageLayout() {
  return (
    <div className="app-shell">
      <SiteNav />
      <main className="page-main">
        <Outlet />
      </main>
      <SiteFooter />
      <div className="mobile-reserve-bar">
        <ButtonLink fullWidth size="lg" to={routes.reservations}>
          Reserve a table
        </ButtonLink>
      </div>
    </div>
  )
}
