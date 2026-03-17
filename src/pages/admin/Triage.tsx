import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Archive, Phone, RefreshCcw } from 'lucide-react'

import OmniscientShell from '../../components/admin/OmniscientShell'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { apiJson, errorMessage } from '../../lib/api'
import { buildQueryString, type OmniscientLead } from '../../lib/omniscient'

export default function Triage() {
  const [leads, setLeads] = useState<OmniscientLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [index, setIndex] = useState(0)
  const [city, setCity] = useState('')
  const [niche, setNiche] = useState('')
  const [hasEmail, setHasEmail] = useState(true)
  const [noWebsite, setNoWebsite] = useState(false)

  const query = useMemo(() => buildQueryString({
    city: city || null,
    hasEmail: hasEmail || null,
    limit: 200,
    niche: niche || null,
    noWebsite: noWebsite || null,
    tier: 'S,A,B',
  }), [city, hasEmail, niche, noWebsite])

  const load = () => {
    setLoading(true)
    setError('')
    return apiJson<{ leads: OmniscientLead[] }>(`/api/omniscient/leads/triage?${query}`, {
      credentials: 'include',
      timeoutMs: 15000,
    })
      .then((data) => {
        setLeads(data.leads || [])
        setIndex(0)
      })
      .catch((err) => setError(errorMessage(err, 'Failed to load triage queue.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [query])

  const currentLead = leads[index] || null

  const archiveLead = async () => {
    if (!currentLead) return
    try {
      await apiJson(`/api/omniscient/leads/${currentLead.id}`, {
        body: JSON.stringify({ isArchived: true }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        timeoutMs: 15000,
      })
      const next = leads.filter((lead) => lead.id !== currentLead.id)
      setLeads(next)
      setIndex((current) => Math.min(current, Math.max(next.length - 1, 0)))
    } catch (err) {
      setError(errorMessage(err, 'Failed to archive lead.'))
    }
  }

  return (
    <OmniscientShell
      subtitle="Rapidly work the best Omniscient leads and archive what is not worth immediate attention."
      title="Triage"
      actions={<button className="btn-secondary btn-sm px-4 py-2 text-xs" onClick={load} type="button"><RefreshCcw className="mr-2 inline h-4 w-4" />Refresh</button>}
    >
      <Card className="axiom-bento p-5">
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input onChange={(e) => setCity(e.target.value)} placeholder="City" value={city} />
          <Input onChange={(e) => setNiche(e.target.value)} placeholder="Niche" value={niche} />
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-axiom-text-mute">
            <input checked={hasEmail} onChange={(e) => setHasEmail(e.target.checked)} type="checkbox" />
            Has Email
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-axiom-text-mute">
            <input checked={noWebsite} onChange={(e) => setNoWebsite(e.target.checked)} type="checkbox" />
            No Website
          </label>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {loading ? <p className="text-sm text-axiom-text-mute">Loading triage queue...</p> : null}

      {!loading && !currentLead ? (
        <Card className="axiom-bento p-8">
          <CardContent className="items-center text-center">
            <p className="text-lg text-axiom-text-main">No triage leads match the current filters.</p>
            <p className="text-sm text-axiom-text-mute">Try widening the queue or run a new hunt.</p>
          </CardContent>
        </Card>
      ) : null}

      {!loading && currentLead ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr),320px]">
          <Card className="axiom-bento p-8">
            <CardHeader className="border-b border-axiom-border pb-4">
              <CardTitle className="text-2xl">{currentLead.businessName}</CardTitle>
              <p className="text-xs uppercase tracking-[0.18em] text-axiom-text-mute">
                {currentLead.niche} • {currentLead.city} • {currentLead.axiomTier || '—'} tier • {currentLead.axiomScore ?? 0}/100
              </p>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-axiom-border px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">Contact</div>
                  <div className="mt-2 text-sm text-axiom-text-main">{currentLead.email || 'No email'}<br />{currentLead.phone || 'No phone'}</div>
                </div>
                <div className="rounded-xl border border-axiom-border px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">Website</div>
                  <div className="mt-2 text-sm text-axiom-text-main">{currentLead.websiteStatus || 'Unknown'} • {currentLead.websiteGrade || '—'}</div>
                </div>
              </div>

              <div className="rounded-xl border border-axiom-border px-4 py-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">Call Opener</div>
                <p className="mt-3 text-sm text-axiom-text-main">{currentLead.callOpener || 'No opener generated yet.'}</p>
              </div>

              <div className="rounded-xl border border-axiom-border px-4 py-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">Follow Up Question</div>
                <p className="mt-3 text-sm text-axiom-text-main">{currentLead.followUpQuestion || 'No follow-up question generated yet.'}</p>
              </div>

              <div className="rounded-xl border border-axiom-border px-4 py-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">Tactical Note</div>
                <p className="mt-3 text-sm text-axiom-text-main">{currentLead.tacticalNote || 'No tactical note generated yet.'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="axiom-bento p-6">
            <CardHeader className="border-b border-axiom-border pb-4">
              <CardTitle className="text-xl">Action Dock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              <div className="rounded-xl border border-axiom-border px-4 py-3 text-sm text-axiom-text-mute">
                Lead {index + 1} of {leads.length}
              </div>
              <Link className="btn-secondary btn-md flex w-full items-center justify-center gap-2 px-4 py-3 text-sm" to={`/lead/${currentLead.id}`}>
                Open Dossier
              </Link>
              {currentLead.phone ? (
                <a className="btn-secondary btn-md flex w-full items-center justify-center gap-2 px-4 py-3 text-sm" href={`tel:${currentLead.phone}`}>
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
              ) : null}
              <button className="btn-secondary btn-md flex w-full items-center justify-center gap-2 px-4 py-3 text-sm" onClick={archiveLead} type="button">
                <Archive className="h-4 w-4" />
                Archive Lead
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="btn-secondary btn-md flex items-center justify-center gap-2 px-4 py-3 text-sm"
                  disabled={index === 0}
                  onClick={() => setIndex((current) => Math.max(current - 1, 0))}
                  type="button"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Prev
                </button>
                <button
                  className="btn-secondary btn-md flex items-center justify-center gap-2 px-4 py-3 text-sm"
                  disabled={index >= leads.length - 1}
                  onClick={() => setIndex((current) => Math.min(current + 1, leads.length - 1))}
                  type="button"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </OmniscientShell>
  )
}
