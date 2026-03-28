import { ButtonAnchor, ButtonLink } from '../components/ui/Button'
import { routes } from '../config/routes'
import { restaurantContent } from '../content/restaurantContent'

const trustPoints = [
  'Seasonal menus shaped weekly',
  'Waterfront dining room in Toronto',
  'Private dining for up to 12 guests',
  'Reservations open 30 days ahead',
]

const featuredDishes = [
  {
    eyebrow: 'First course',
    title: 'Hamachi crudo, cucumber, green pear, dill oil',
    description:
      'Bright, clean, and paced to wake up the table without rushing the evening.',
    accent: 'A sharp opening with coastal lift',
  },
  {
    eyebrow: 'Main course',
    title: 'Charred duck breast, sour cherry, endive, jus',
    description:
      'Deep flavor with a restrained finish that holds together across the last bite.',
    accent: 'Built for a slower second half',
  },
  {
    eyebrow: 'Dessert',
    title: 'Chocolate tart, espresso cream, black salt',
    description:
      'A quiet final course that keeps the room warm without tipping into heavy sweetness.',
    accent: 'Composed, polished, memorable',
  },
]

const roomPoints = [
  'Low light without the stiffness',
  'Hosts who pace the meal, not just the table',
  'A room tuned for conversation and celebration',
]

const chefPrinciples = [
  {
    title: 'Seasonality first',
    description:
      'The menu changes with what is best now, not what is easiest to repeat.',
  },
  {
    title: 'Clarity on the plate',
    description:
      'Each dish should read quickly, then finish cleanly enough to remember.',
  },
  {
    title: 'Timing matters',
    description:
      'The kitchen and dining room work together so the course sequence feels calm.',
  },
]

const privateDiningNotes = [
  'Twelve-seat private room',
  'Birthday dinners and client nights',
  'Concierge coordination available',
  'Guided pairings and set menus on request',
]

const reservationPhone = restaurantContent.brand.phone.replace(/[^+\d]/g, '')

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: string
  description: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={
        align === 'center'
          ? 'section-heading section-heading--center'
          : 'section-heading'
      }
    >
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <h2 className="section-heading__title">{title}</h2>
      <p className="section-heading__description">{description}</p>
    </div>
  )
}

function SceneCard({
  src,
  alt,
  eyebrow,
  title,
  description,
  className = '',
  loading = 'lazy',
}: {
  src: string
  alt: string
  eyebrow: string
  title: string
  description?: string
  className?: string
  loading?: 'eager' | 'lazy'
}) {
  return (
    <figure className={`scene-card ${className}`.trim()}>
      <img alt={alt} className="scene-card__image" loading={loading} src={src} />
      <figcaption className="scene-card__overlay">
        <p className="scene-card__eyebrow">{eyebrow}</p>
        <h3 className="scene-card__title">{title}</h3>
        {description ? <p className="scene-card__description">{description}</p> : null}
      </figcaption>
    </figure>
  )
}

export function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="home-hero__eyebrow">Seasonal waterfront dining in Toronto</p>
          <h1 className="home-hero__title">
            A waterfront dinner worth booking tonight.
          </h1>
          <p className="home-hero__description">
            Atelier Meridian pairs seasonal coastal ingredients, a calm dining room, and warm
            service for evenings that should feel like an occasion from the first pour.
          </p>

          <div className="home-hero__actions">
            <ButtonLink size="lg" to={routes.reservations}>
              Reserve a table
            </ButtonLink>
            <ButtonLink size="lg" to={routes.menu} variant="secondary">
              Explore the menu
            </ButtonLink>
          </div>

          <dl className="home-hero__facts">
            <div className="home-hero__fact">
              <dt>Room</dt>
              <dd>Waterfront, low-lit, intimate</dd>
            </div>
            <div className="home-hero__fact">
              <dt>Dining style</dt>
              <dd>Chef-led tasting and composed plates</dd>
            </div>
            <div className="home-hero__fact">
              <dt>Private dining</dt>
              <dd>For up to 12 guests</dd>
            </div>
          </dl>
        </div>

        <div className="home-hero__media">
          <div className="hero-board">
            <SceneCard
              alt="Waterfront dining room with warm low light and a dusk horizon"
              className="scene-card--room hero-board__room"
              description="Dinner pace, soft acoustics, and a room that settles in quietly."
              eyebrow="The room"
              loading="eager"
              src="/images/waterfront-room.svg"
              title="Waterfront light, calm service, and a table built for long evenings."
            />

            <SceneCard
              alt="Seasonal plated dish with restrained coastal styling"
              className="scene-card--plate hero-board__plate"
              description="The opening courses stay bright enough to build appetite."
              eyebrow="Tonight"
              loading="eager"
              src="/images/seasonal-plate.svg"
              title={featuredDishes[0].title}
            />

            <div className="scene-card scene-card--note hero-board__note">
              <p className="scene-card__eyebrow">Private dining</p>
              <h3 className="scene-card__title">
                A room for birthdays, client dinners, and quieter celebrations.
              </h3>
              <p className="scene-card__description">
                Twelve seats, direct coordination, and guided pairings when the occasion calls for
                them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="At a glance">
        {trustPoints.map((point) => (
          <p className="trust-strip__item" key={point}>
            {point}
          </p>
        ))}
      </section>

      <section className="home-section">
        <SectionHeading
          eyebrow="What the kitchen is plating now"
          title="A seasonal menu with enough clarity to book around."
          description="The menu changes with the harvest and the fish market, but the tone stays consistent: bright openings, composed mains, and restrained finishes."
        />

        <div className="menu-showcase">
          <article className="menu-feature">
            <img
              alt="Plated seasonal dish in a dark, editorial presentation"
              className="menu-feature__image"
              loading="lazy"
              src="/images/seasonal-plate.svg"
            />
            <div className="menu-feature__body">
              <p className="menu-feature__eyebrow">Featured tonight</p>
              <h3 className="menu-feature__title">{featuredDishes[0].title}.</h3>
              <p className="menu-feature__description">
                {featuredDishes[0].description}
              </p>
              <div className="menu-feature__actions">
                <ButtonLink to={routes.menu}>View the menu</ButtonLink>
                <ButtonLink to={routes.reservations} variant="secondary">
                  Reserve for dinner
                </ButtonLink>
              </div>
            </div>
          </article>

          <div className="menu-stack">
            {featuredDishes.slice(1).map((dish) => (
              <article className="menu-mini" key={dish.title}>
                <p className="menu-mini__eyebrow">{dish.eyebrow}</p>
                <h3 className="menu-mini__title">{dish.title}</h3>
                <p className="menu-mini__description">{dish.description}</p>
                <p className="menu-mini__accent">{dish.accent}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--room">
        <div className="split-layout">
          <div className="split-layout__copy">
            <SectionHeading
              eyebrow="The room after sunset"
              title="A dining room that keeps the evening soft."
              description="The atmosphere is designed to help the meal take the lead: warm light, low noise, and enough space for the table to feel private without feeling hidden."
            />

            <ul className="feature-list">
              {roomPoints.map((point) => (
                <li className="feature-list__item" key={point}>
                  {point}
                </li>
              ))}
            </ul>

            <div className="split-layout__actions">
              <ButtonLink to={routes.about} variant="secondary">
                Learn our story
              </ButtonLink>
              <ButtonLink to={routes.reservations}>Start a reservation</ButtonLink>
            </div>
          </div>

          <SceneCard
            alt="Interior dining room image with soft glowing light and a waterfront mood"
            className="scene-card--room scene-card--room-alt"
            description="The room is tuned for conversation, privacy, and an unhurried pace."
            eyebrow="Atmosphere"
            src="/images/waterfront-room.svg"
            title="Candlelight, wood tones, and room for the evening to breathe."
          />
        </div>
      </section>

      <section className="home-section">
        <div className="chef-layout">
          <article className="chef-quote">
            <p className="chef-quote__eyebrow">Chef-led</p>
            <blockquote className="chef-quote__body">
              {"Seasonality matters when the food is clear enough to remember and calm enough to live with."}
            </blockquote>
            <p className="chef-quote__meta">
              Camille Hart guides the menu with restraint, precision, and a preference for dishes
              that hold together across the full course sequence.
            </p>
          </article>

          <div className="chef-principles">
            {chefPrinciples.map((principle) => (
              <article className="chef-principles__card" key={principle.title}>
                <p className="chef-principles__eyebrow">{principle.title}</p>
                <p className="chef-principles__description">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="private-panel">
          <div className="private-panel__copy">
            <SectionHeading
              eyebrow="Private dining"
              title="A private room that still feels like dinner out."
              description="The private room is made for birthdays, client dinners, and close celebrations that deserve the same service tone as the main room."
            />
          </div>

          <div className="private-panel__details">
            {privateDiningNotes.map((note) => (
              <p className="private-panel__note" key={note}>
                {note}
              </p>
            ))}
          </div>

          <div className="private-panel__actions">
            <ButtonLink to={routes.reservations}>Plan a private dinner</ButtonLink>
            <ButtonAnchor href={`mailto:${restaurantContent.brand.email}`} variant="secondary">
              Email the concierge
            </ButtonAnchor>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="booking-panel">
          <div className="booking-panel__copy">
            <p className="booking-panel__eyebrow">Reservations</p>
            <h2 className="booking-panel__title">Hold the table tonight.</h2>
            <p className="booking-panel__description">
              {restaurantContent.reservations.intro}
            </p>

            <div className="booking-panel__actions">
              <ButtonLink size="lg" to={routes.reservations}>
                Reserve a table
              </ButtonLink>
              <ButtonAnchor href={`tel:${reservationPhone}`} size="lg" variant="secondary">
                Call reservations
              </ButtonAnchor>
            </div>

            <p className="booking-panel__subtle">
              For private dining or parties above eight, call or email directly and we will guide
              the next step.
            </p>
          </div>

          <div className="booking-panel__details">
            <div className="booking-panel__detail-group">
              <p className="booking-panel__detail-label">Visit</p>
              <p className="booking-panel__detail-value">{restaurantContent.brand.address}</p>
            </div>

            <div className="booking-panel__detail-group">
              <p className="booking-panel__detail-label">Hours</p>
              <ul className="booking-panel__list">
                {restaurantContent.brand.hours.map((hour) => (
                  <li key={hour}>{hour}</li>
                ))}
              </ul>
            </div>

            <div className="booking-panel__detail-group">
              <p className="booking-panel__detail-label">Before you book</p>
              <ul className="booking-panel__list">
                {restaurantContent.reservations.policies.map((policy) => (
                  <li key={policy}>{policy}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
