import { restaurantContent } from '../../content/restaurantContent'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <h2 className="site-footer__brand">{restaurantContent.brand.name}</h2>
          <p className="site-footer__tagline">{restaurantContent.brand.tagline}</p>
        </div>

        <div>
          <h3 className="site-footer__heading">Visit</h3>
          <p>{restaurantContent.brand.address}</p>
        </div>

        <div>
          <h3 className="site-footer__heading">Hours</h3>
          <ul className="plain-list">
            {restaurantContent.brand.hours.map((hour) => (
              <li key={hour}>{hour}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="site-footer__heading">Contact</h3>
          <ul className="plain-list">
            <li>
              <a href="tel:+14165550182">{restaurantContent.brand.phone}</a>
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
        {new Date().getFullYear()} Atelier Meridian. All rights reserved.
      </p>
    </footer>
  )
}
