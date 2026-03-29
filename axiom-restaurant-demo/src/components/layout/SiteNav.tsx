import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { normalizePathname, navItems, routes } from '../../config/routes'
import { restaurantContent } from '../../content/restaurantContent'
import { ButtonAnchor, ButtonLink } from '../ui/Button'

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const isHomePage = normalizePathname(location.pathname) === routes.home
  const isReservationsPage = normalizePathname(location.pathname) === routes.reservations

  return (
    <header className="site-nav-wrap">
      <div className="site-nav">
        <NavLink className="site-brand" to={routes.home}>
          <span className="site-brand__name">{restaurantContent.brand.name}</span>
          <span className="site-brand__city">{restaurantContent.brand.city}</span>
        </NavLink>

        <button
          aria-controls="primary-nav"
          aria-expanded={isOpen}
          className="mobile-menu-toggle"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          Menu
        </button>

        <nav
          className={`primary-nav ${isOpen ? 'primary-nav--open' : ''}`}
          id="primary-nav"
        >
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                ['primary-nav__link', isActive ? 'primary-nav__link--active' : '']
                  .filter(Boolean)
                  .join(' ')
              }
              key={item.path}
              onClick={() => setIsOpen(false)}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
          {isReservationsPage ? (
            <ButtonAnchor
              className="primary-nav__reserve"
              href="tel:+14165550182"
              size="md"
              variant="quiet"
            >
              Call concierge
            </ButtonAnchor>
          ) : isHomePage ? null : (
            <ButtonLink className="primary-nav__reserve" size="md" to={routes.reservations} variant="secondary">
              Reserve a table
            </ButtonLink>
          )}
        </nav>
      </div>
    </header>
  )
}
