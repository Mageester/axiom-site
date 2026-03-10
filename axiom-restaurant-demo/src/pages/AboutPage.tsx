import { routes } from '../config/routes'
import { restaurantContent } from '../content/restaurantContent'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHero } from '../components/ui/PageHero'
import { Section } from '../components/ui/Section'

export function AboutPage() {
  return (
    <>
      <PageHero
        actions={
          <ButtonLink to={routes.reservations}>Reserve your visit</ButtonLink>
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

      <Section title="Operating values">
        <div className="card-grid card-grid--3">
          {restaurantContent.about.values.map((value) => (
            <Card
              description={value.description}
              key={value.title}
              title={value.title}
            />
          ))}
        </div>
      </Section>

      <Section title="Leadership">
        <div className="team-grid">
          {restaurantContent.about.team.map((member) => (
            <Card
              description={member.bio}
              key={member.name}
              meta={member.role}
              title={member.name}
            />
          ))}
        </div>
      </Section>
    </>
  )
}
