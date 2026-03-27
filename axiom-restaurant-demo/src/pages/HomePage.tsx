import { routes } from '../config/routes'
import { restaurantContent } from '../content/restaurantContent'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHero } from '../components/ui/PageHero'
import { Section } from '../components/ui/Section'

const servicePillars = ['12-course tasting option', 'Sommelier-led pairings', 'Private studio for 12']

export function HomePage() {
  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink size="lg" to={routes.reservations}>
              {restaurantContent.home.hero.primaryCta}
            </ButtonLink>
            <ButtonLink size="lg" to={routes.menu} variant="secondary">
              {restaurantContent.home.hero.secondaryCta}
            </ButtonLink>
          </>
        }
        description={restaurantContent.home.hero.description}
        eyebrow={restaurantContent.home.hero.eyebrow}
        title={restaurantContent.home.hero.title}
      />
      <div className="hero-signals" aria-label="Dining signals">
        <div>
          <p className="hero-signals__label">Service style</p>
          <p className="hero-signals__value">Reservation-first · Evening-only</p>
        </div>
        <div>
          <p className="hero-signals__label">Menu cadence</p>
          <p className="hero-signals__value">Weekly seasonal edits</p>
        </div>
        <div>
          <p className="hero-signals__label">Lead time</p>
          <p className="hero-signals__value">Bookings open 30 days ahead</p>
        </div>
      </div>

      <Section
        description="Refined service moments designed for date nights, celebrations, and business dinners."
        title="Signature experience"
      >
        <div className="card-grid card-grid--3">
          {restaurantContent.home.highlights.map((item, index) => (
            <Card
              description={item.description}
              key={item.title}
              meta={servicePillars[index]}
              title={item.title}
            />
          ))}
        </div>
      </Section>

      <Section
        description={restaurantContent.menu.intro}
        title="Seasonal menu preview"
      >
        <div className="menu-preview-grid">
          {restaurantContent.menu.sections.map((section) => (
            <Card key={section.title} title={section.title}>
              <p className="menu-preview-note">{section.note}</p>
              <ul className="plain-list menu-preview-list">
                {section.items.slice(0, 2).map((item) => (
                  <li className="menu-preview-list__item" key={item.name}>
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
      <Section
        description="Each evening is calibrated for pace, clarity, and table comfort."
        title="Chef's note"
      >
        <blockquote className="chef-note">
          “We build menus that feel exacting without feeling formal. The goal is a room that
          stays calm, responsive, and unmistakably special.”
          <cite>— Camille Hart, Executive Chef</cite>
        </blockquote>
      </Section>

      <Section
        description={restaurantContent.home.experience.description}
        title={restaurantContent.home.experience.title}
      >
        <div className="experience-panel">
          <ul className="check-list">
            {restaurantContent.home.experience.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="experience-panel__actions">
            <ButtonLink to={routes.reservations}>Start reservation</ButtonLink>
            <ButtonLink to={routes.about} variant="quiet">
              Learn our story
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}
