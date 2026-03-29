import { type FormEvent, useState } from 'react'
import { siteConfig } from '../config/siteConfig'
import { restaurantContent } from '../content/restaurantContent'
import { Button, ButtonAnchor } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { Section } from '../components/ui/Section'

export function ReservationsPage() {
  const [statusMessage, setStatusMessage] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = (formData.get('name') as string)?.trim() ?? ''
    const contact = (formData.get('contact') as string)?.trim() ?? ''
    const date = (formData.get('date') as string)?.trim() ?? ''
    const guests = (formData.get('guests') as string)?.trim() ?? ''
    const notes = (formData.get('notes') as string)?.trim() ?? ''

    const body = [
      `Name: ${name || 'Not provided'}`,
      `Contact: ${contact || 'Not provided'}`,
      `Preferred Date: ${date || 'Not provided'}`,
      `Guests: ${guests || 'Not provided'}`,
      `Notes: ${notes || 'None'}`,
    ].join('\n')

    const query = new URLSearchParams({
      subject: `Reservation request from ${name || 'Guest'}`,
      body,
    })

    window.location.href = `mailto:${restaurantContent.brand.email}?${query.toString()}`
    setStatusMessage('Your email app is opening with the reservation details.')
    event.currentTarget.reset()
  }

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonAnchor href="#request-form" size="lg" variant="primary">
              Start reservation request
            </ButtonAnchor>
            <ButtonAnchor href="tel:+14165550182" size="lg" variant="secondary">
              Call concierge
            </ButtonAnchor>
          </>
        }
        description={restaurantContent.reservations.intro}
        eyebrow="Reservations"
        title="Reserve with the room, not a marketplace."
      />

      <Section
        description="Choose the direct path first. The booking partner stays available for standard tables when instant inventory matters more than concierge handling."
        title="How Atelier Meridian handles reservations"
      >
        <div className="reservation-brief">
          <div className="reservation-brief__panel">
            <p className="reservation-brief__eyebrow">Direct reservation path</p>
            <h3>Concierge reviews the table, timing, and service notes before confirming.</h3>
            <p>
              Reservations open 30 days ahead. Private dining, hosted tables, and larger parties
              are kept in-house so the evening can be set properly from the first reply.
            </p>
          </div>

          <div className="reservation-brief__support">
            <div className="reservation-brief__links">
              {restaurantContent.reservations.channels.map((channel) => (
                <a className="reservation-link" key={channel.label} href={channel.href}>
                  <span>{channel.label}</span>
                  <strong>{channel.value}</strong>
                </a>
              ))}
            </div>

            <aside className="reservation-partner">
              <p className="reservation-partner__eyebrow">
                {restaurantContent.reservations.partnerBooking.label}
              </p>
              <h3>{restaurantContent.reservations.partnerBooking.value}</h3>
              <p>{restaurantContent.reservations.partnerBooking.note}</p>
              <ButtonAnchor
                href={restaurantContent.reservations.partnerBooking.href}
                rel="noreferrer"
                target="_blank"
                variant="secondary"
              >
                Use booking partner
              </ButtonAnchor>
            </aside>
          </div>
        </div>
      </Section>

      <Section
        id="request-form"
        description="Share the basics and we will draft the details for concierge review."
        title="Reservation request form"
      >
        <div className="reservation-layout">
          <form className="reservation-form" onSubmit={onSubmit}>
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" required type="text" />

            <label htmlFor="contact">Email or phone</label>
            <input id="contact" name="contact" required type="text" />

            <label htmlFor="date">Preferred date</label>
            <input id="date" name="date" required type="date" />

            <label htmlFor="guests">Party size</label>
            <select id="guests" name="guests" required>
              <option value="">Select</option>
              {[...Array(siteConfig.partySizeCap)].map((_, index) => {
                const value = String(index + 1)
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                )
              })}
            </select>

            <label htmlFor="notes">Occasion or dietary notes</label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Anniversary, dietary restrictions, seating preferences..."
            />

            <Button size="lg" type="submit">
              Send request
            </Button>
            {statusMessage ? <p className="form-status">{statusMessage}</p> : null}
          </form>

          <aside className="policy-panel">
            <h3>What happens next</h3>
            <ul className="check-list check-list--tight">
              <li>Requests are reviewed manually by the restaurant team.</li>
              <li>Private dining and large parties are confirmed by concierge.</li>
              <li>Dietary and accessibility notes are checked before service.</li>
            </ul>
            <p className="policy-panel__subtle">
              For same-day changes or groups over {siteConfig.partySizeCap}, call {restaurantContent.brand.phone}.
            </p>
          </aside>
        </div>
      </Section>
    </>
  )
}
