import { routes } from '../config/routes'
import { restaurantContent } from '../content/restaurantContent'
import { ButtonLink } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { Section } from '../components/ui/Section'

export function AboutPage() {
  return (
    <>
      <PageHero
        actions={
          <ButtonLink size="lg" to={routes.reservations}>
            Reserve your visit
          </ButtonLink>
        }
        description={restaurantContent.about.intro}
        eyebrow="About"
        title="People, process, and place"
      />

      <Section title="Our approach">
        <div className="story-grid">
          {restaurantContent.about.story.map((paragraph) => (
            <p className="story-grid__paragraph" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section
        description="Three rules keep the room calm and the booking reliable."
        title="Operating values"
      >
        <div className="about-values">
          {restaurantContent.about.values.map((value) => (
            <article className="value-row" key={value.title}>
              <p className="value-row__eyebrow">Principle</p>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        description="A small team keeps the dining room consistent night after night."
        title="Leadership"
      >
        <div className="team-rows">
          {restaurantContent.about.team.map((member) => (
            <article className="team-row" key={member.name}>
              <div>
                <p className="team-row__role">{member.role}</p>
                <h3>{member.name}</h3>
              </div>
              <p>{member.bio}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
