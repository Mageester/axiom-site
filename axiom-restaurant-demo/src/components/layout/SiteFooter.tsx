import { routes } from '../../config/routes'
import { restaurantContent } from '../../content/restaurantContent'
import { ButtonLink } from '../ui/Button'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <div>
          <p className="site-footer__eyebrow">Seasonal waterfront dining</p>
          <h2 className="site-footer__brand">{restaurantContent.brand.name}</h2>
          <p className="site-footer__tagline">
            Coastal influence, quiet service, and dinners that feel worth dressing for.
          </p>
        </div>

        <ButtonLink size="lg" to={routes.reservations}>
          Reserve a table
        </ButtonLink>
      </div>

      <div className="site-footer__grid">
        <div>
          <h3 className="site-footer__heading">Visit</h3>
          <p>{restaurantContent.brand.address}</p>
          <p className="site-footer__muted">Private dining and reservations welcome.</p>
        </div>

        <div>
          <h3 className="site-footer__heading">Hours</h3>
          <ul className="plain-list site-footer__list">
            {restaurantContent.brand.hours.map((hour) => (
              <li key={hour}>{hour}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="site-footer__heading">Contact</h3>
          <ul className="plain-list site-footer__list">
            <li>
              <a href={`tel:${restaurantContent.brand.phone.replace(/[^+\d]/g, '')}`}>
                {restaurantContent.brand.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${restaurantContent.brand.email}`}>
                {restaurantContent.brand.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="site-footer__legal">
        {new Date().getFullYear()} Atelier Meridian. Seasonal waterfront dining in Toronto.
      </p>
    </footer>
  )
}
