import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { routes } from '../../config/routes'
import { ButtonLink } from '../ui/Button'
import { SiteFooter } from './SiteFooter'
import { SiteNav } from './SiteNav'

const pageMeta = {
  [routes.home]: {
    title: "Atelier Meridian | Seasonal Dining on Toronto's Waterfront",
    description:
      'Atelier Meridian is a chef-led waterfront restaurant in Toronto serving seasonal dining, curated pairings, and concierge-style reservations.',
  },
  [routes.menu]: {
    title: 'Atelier Meridian | Seasonal Menu',
    description:
      'Explore the seasonal menu at Atelier Meridian, where ingredient-led plates move in short, deliberate cycles.',
  },
  [routes.about]: {
    title: 'Atelier Meridian | About the Dining Room',
    description:
      'Learn about the dining room, the chef-led service style, and the calm waterfront setting at Atelier Meridian.',
  },
  [routes.reservations]: {
    title: 'Atelier Meridian | Reservations and Concierge',
    description:
      'Start with a direct reservation request or concierge call for dinner, private dining, and hosted tables at Atelier Meridian.',
  },
} as const

function updateMetaContent(pathname: string) {
  const fallback = pageMeta[routes.home]
  const meta = pageMeta[pathname as keyof typeof pageMeta] ?? fallback

  document.title = meta.title

  const selectors = [
    ['meta[name="description"]', 'content', meta.description],
    ['meta[property="og:title"]', 'content', meta.title],
    ['meta[property="og:description"]', 'content', meta.description],
    ['meta[name="twitter:title"]', 'content', meta.title],
    ['meta[name="twitter:description"]', 'content', meta.description],
  ] as const

  selectors.forEach(([selector, attribute, value]) => {
    const element = document.querySelector(selector)
    if (element) {
      element.setAttribute(attribute, value)
    }
  })
}

export function PageLayout() {
  const location = useLocation()

  useEffect(() => {
    updateMetaContent(location.pathname)
  }, [location.pathname])

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
