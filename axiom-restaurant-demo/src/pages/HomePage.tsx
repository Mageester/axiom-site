import { routes } from '../config/routes'
import { restaurantContent } from '../content/restaurantContent'
import { ButtonAnchor, ButtonLink } from '../components/ui/Button'
import { Section } from '../components/ui/Section'

const heroImage =
  'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop'
const experienceImage =
  'https://images.pexels.com/photos/18272528/pexels-photo-18272528.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop'
const menuImage =
  'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1000&fit=crop'
const privateDiningImage =
  'https://images.pexels.com/photos/28871005/pexels-photo-28871005.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop'
const chefImage =
  'https://images.pexels.com/photos/628776/pexels-photo-628776.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop'

const heroSignals = [
  { label: 'Dinner service', value: 'Tuesday to Sunday' },
  { label: 'Reservation lead', value: '30 days ahead' },
  { label: 'Private dining', value: 'Up to 12 guests' },
]

export function HomePage() {
  return (
    <>
      <section className="hero-bleed">
        <div
          aria-hidden="true"
          className="hero-bleed__media"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="hero-bleed__veil" aria-hidden="true" />
        <div className="hero-bleed__content">
          <p className="hero-bleed__eyebrow">{restaurantContent.home.hero.eyebrow}</p>
          <h1 className="hero-bleed__title">{restaurantContent.home.hero.title}</h1>
          <p className="hero-bleed__description">{restaurantContent.home.hero.description}</p>
          <div className="hero-bleed__actions">
            <ButtonLink size="lg" to={routes.reservations}>
              {restaurantContent.home.hero.primaryCta}
            </ButtonLink>
            <ButtonLink size="lg" to={routes.menu} variant="secondary">
              {restaurantContent.home.hero.secondaryCta}
            </ButtonLink>
          </div>
          <div className="hero-bleed__details">
            {heroSignals.map((signal) => (
              <span key={signal.label}>
                <strong>{signal.label}</strong>
                <span>{signal.value}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="hero-signals" aria-label="Dining signals">
        {heroSignals.map((signal) => (
          <div key={signal.label}>
            <p className="hero-signals__label">{signal.label}</p>
            <p className="hero-signals__value">{signal.value}</p>
          </div>
        ))}
      </div>

      <Section
        description="A composed room with clear pacing, attentive service, and calm coastal tone."
        eyebrow="Signature evenings"
        title={restaurantContent.home.experience.title}
      >
        <div className="experience-split">
          <div className="image-panel">
            <img
              alt="Warmly lit dining room prepared for evening service"
              src={experienceImage}
              loading="lazy"
            />
            <div className="image-panel__label">Main dining room</div>
          </div>
          <div className="experience-split__body">
            <div className="feature-list">
              {restaurantContent.home.highlights.map((item) => (
                <div className="feature-row" key={item.title}>
                  <p className="feature-row__title">{item.title}</p>
                  <p className="feature-row__description">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="experience-split__actions">
              <ButtonLink to={routes.reservations}>Reserve for dinner</ButtonLink>
              <ButtonLink to={routes.about} variant="secondary">
                Explore the dining room
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section
        description={restaurantContent.menu.intro}
        eyebrow="Seasonal menu"
        title="Ingredient-led plates, written in short cycles."
      >
        <div className="menu-split">
          <div className="menu-split__intro">
            <p className="menu-split__copy">
              The menu moves in short arcs, edited for clarity, pairing rhythm, and a clean finish.
            </p>
            <ButtonLink to={routes.menu} variant="secondary">
              View full menu
            </ButtonLink>
            <div className="menu-split__image">
              <img
                alt="Seasonal plated course in the dining room"
                src={menuImage}
                loading="lazy"
              />
            </div>
          </div>
          <div className="menu-ledger">
            {restaurantContent.menu.sections.map((section) => (
              <div className="menu-ledger__section" key={section.title}>
                <div className="menu-ledger__header">
                  <p className="menu-ledger__title">{section.title}</p>
                  <p className="menu-ledger__note">{section.note}</p>
                </div>
                <ul className="plain-list menu-ledger__items">
                  {section.items.slice(0, 2).map((item) => (
                    <li className="menu-ledger__item" key={item.name}>
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        description={restaurantContent.home.experience.description}
        eyebrow="Private dining"
        title="A private studio for hosted tables and quiet celebrations."
      >
        <div className="room-split">
          <div className="room-split__content">
            <p className="room-split__copy">
              A separate dining studio supports hosted dinners, executive tables, and
              family celebrations with a dedicated service sequence.
            </p>
            <ul className="check-list check-list--tight">
              {restaurantContent.home.experience.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="room-split__actions">
              <ButtonLink to={routes.reservations}>Reserve private dining</ButtonLink>
              <ButtonAnchor href="tel:+14165550182" variant="secondary">
                Call concierge
              </ButtonAnchor>
            </div>
          </div>
          <div className="image-panel image-panel--tall">
            <img
              alt="Private dining room with warm ambient lighting"
              src={privateDiningImage}
              loading="lazy"
            />
            <div className="image-panel__label">Private dining studio</div>
          </div>
        </div>
      </Section>

      <Section
        description="Chef-led cuisine with calm, deliberate service."
        eyebrow="From the kitchen"
        title="Precision without ceremony."
      >
        <div className="chef-split">
          <blockquote className="chef-note">
            "We build menus that feel exacting without feeling formal. The goal is a room
            that stays calm, responsive, and unmistakably special."
            <cite>- Camille Hart, Executive Chef</cite>
          </blockquote>
          <div className="image-panel image-panel--tall">
            <img
              alt="Chef plating in an open kitchen setting"
              src={chefImage}
              loading="lazy"
            />
            <div className="image-panel__label">Kitchen pass</div>
          </div>
        </div>
      </Section>

      <Section
        className="section--final"
        description="Reservations open 30 days in advance. For hosted tables and private dining, contact our concierge directly."
        eyebrow="Reservations"
        title="Reserve your table for dinner."
      >
        <div className="reserve-cta">
          <div className="reserve-cta__body">
            <p>
              Reservations open 30 days in advance. For hosted tables and private dining, our concierge
              can help coordinate the details.
            </p>
            <div className="reserve-cta__actions">
              <ButtonLink size="lg" to={routes.reservations}>
                Reserve a table
              </ButtonLink>
              <ButtonLink size="lg" to={routes.menu} variant="secondary">
                View menu
              </ButtonLink>
            </div>
          </div>
          <div className="reserve-cta__details">
            <p className="reserve-cta__label">Reservation channels</p>
            <ul className="plain-list reserve-cta__list">
              {restaurantContent.reservations.channels.map((channel) => (
                <li key={channel.label}>
                  <span>{channel.label}</span>
                  <span>{channel.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}
