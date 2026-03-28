import { NavLink } from 'react-router-dom'
import { navItems, routes } from '../../config/routes'
import { restaurantContent } from '../../content/restaurantContent'
import { ButtonLink } from '../ui/Button'

export function SiteNav() {
  return (
    <header className="site-nav-wrap">
      <div className="site-nav">
        <NavLink className="site-brand" to={routes.home}>
          <span className="site-brand__name">{restaurantContent.brand.name}</span>
          <span className="site-brand__city">{restaurantContent.brand.city}</span>
        </NavLink>

        <nav className="primary-nav" id="primary-nav">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                ['primary-nav__link', isActive ? 'primary-nav__link--active' : '']
                  .filter(Boolean)
                  .join(' ')
              }
              key={item.path}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ButtonLink className="primary-nav__reserve" size="md" to={routes.reservations}>
          Reserve
        </ButtonLink>
      </div>
    </header>
  )
}
