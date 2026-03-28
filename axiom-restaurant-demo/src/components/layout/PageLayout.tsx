import { Outlet } from 'react-router-dom'
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
    </div>
  )
}
