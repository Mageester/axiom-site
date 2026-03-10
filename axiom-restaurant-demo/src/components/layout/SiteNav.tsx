import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navItems, routes } from '../../config/routes'
import { restaurantContent } from '../../content/restaurantContent'
import { ButtonLink } from '../ui/Button'

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false)

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
          <ButtonLink className="primary-nav__reserve" size="md" to={routes.reservations}>
            Reserve
          </ButtonLink>
        </nav>
      </div>
    </header>
  )
}
