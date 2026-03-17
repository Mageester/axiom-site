import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExternalLink, Save } from 'lucide-react'

import OmniscientShell from '../../components/admin/OmniscientShell'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { apiJson, errorMessage } from '../../lib/api'
import type { OmniscientLead } from '../../lib/omniscient'

function parseList(value: string | null) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseAssessment(value: string | null) {
  if (!value) return null
  try {
    return JSON.parse(value) as { topFixes?: string[]; overallGrade?: string }
  } catch {
    return null
  }
}

export default function OmniscientLeadDetail() {
  const { id } = useParams<{ id: string }>()
  const [lead, setLead] = useState<OmniscientLead | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [form, setForm] = useState({
    contactName: '',
    email: '',
    phone: '',
    tacticalNote: '',
    callOpener: '',
    followUpQuestion: '',
    isArchived: false,
  })

  const load = () => {
    if (!id) return
    setLoading(true)
    setError('')
    apiJson<{ lead: OmniscientLead }>(`/api/omniscient/leads/${id}`, {
      credentials: 'include',
      timeoutMs: 15000,
    })
      .then((data) => {
        setLead(data.lead)
        setForm({
          callOpener: data.lead.callOpener || '',
          contactName: data.lead.contactName || '',
          email: data.lead.email || '',
          followUpQuestion: data.lead.followUpQuestion || '',
          isArchived: Boolean(data.lead.isArchived),
          phone: data.lead.phone || '',
          tacticalNote: data.lead.tacticalNote || '',
        })
      })
      .catch((err) => setError(errorMessage(err, 'Failed to load lead dossier.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [id])

  const painSignals = useMemo(() => parseList(lead?.painSignals || null), [lead?.painSignals])
  const disqualifiers = useMemo(() => parseList(lead?.disqualifiers || null), [lead?.disqualifiers])
  const assessment = useMemo(() => parseAssessment(lead?.axiomWebsiteAssessment || null), [lead?.axiomWebsiteAssessment])

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    setError('')
    setSaveMessage('')
    try {
      const response = await apiJson<{ lead: OmniscientLead }>(`/api/omniscient/leads/${id}`, {
        body: JSON.stringify(form),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        timeoutMs: 15000,
      })
      setLead(response.lead)
      setSaveMessage('Lead updates saved.')
    } catch (err) {
      setError(errorMessage(err, 'Failed to save lead changes.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <OmniscientShell
      subtitle="Inspect the AI-enriched lead dossier, evidence, and operator notes for this target."
      title={lead?.businessName || 'Lead Dossier'}
      actions={<Link className="btn-secondary btn-sm px-4 py-2 text-xs" to="/vault">Back to Vault</Link>}
    >
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {saveMessage ? <p className="text-sm text-emerald-400">{saveMessage}</p> : null}
      {loading ? <p className="text-sm text-axiom-text-mute">Loading dossier...</p> : null}

      {!loading && lead ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr),420px]">
          <div className="space-y-4">
            <Card className="axiom-bento p-6">
              <CardHeader className="border-b border-axiom-border pb-4">
                <CardTitle className="text-xl">Lead Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-5 md:grid-cols-2">
                <div className="rounded-xl border border-axiom-border px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">Tier / Score</div>
                  <div className="mt-2 text-xl font-semibold text-axiom-text-main">{lead.axiomTier || '—'} • {lead.axiomScore ?? 0}/100</div>
                </div>
                <div className="rounded-xl border border-axiom-border px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">Website</div>
                  <div className="mt-2 text-xl font-semibold text-axiom-text-main">{lead.websiteStatus || 'Unknown'} • {lead.websiteGrade || '—'}</div>
                </div>
                <div className="rounded-xl border border-axiom-border px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">Contact</div>
                  <div className="mt-2 text-sm text-axiom-text-main">{lead.email || 'No email'}<br />{lead.phone || 'No phone'}</div>
                </div>
                <div className="rounded-xl border border-axiom-border px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">Location</div>
                  <div className="mt-2 text-sm text-axiom-text-main">{lead.city}<br />{lead.address || 'No address'}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="axiom-bento p-6">
              <CardHeader className="border-b border-axiom-border pb-4">
                <CardTitle className="text-xl">Pain Signals & Fixes</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-5">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-axiom-text-mute">Pain Signals</p>
                  <div className="space-y-3">
                    {painSignals.length > 0 ? painSignals.map((signal: any, index: number) => (
                      <div key={`${signal.type}-${index}`} className="rounded-xl border border-axiom-border px-4 py-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-axiom-text-main">{signal.type || 'Pain'}</div>
                        <div className="mt-2 text-sm text-axiom-text-mute">{signal.evidence || ''}</div>
                      </div>
                    )) : <p className="text-sm text-axiom-text-mute">No pain signals recorded.</p>}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-axiom-text-mute">Top Fixes</p>
                  <div className="space-y-2">
                    {(assessment?.topFixes || []).length > 0 ? assessment?.topFixes?.map((fix, index) => (
                      <div key={`${fix}-${index}`} className="rounded-xl border border-axiom-border px-4 py-3 text-sm text-axiom-text-main">
                        {fix}
                      </div>
                    )) : <p className="text-sm text-axiom-text-mute">No website fixes generated.</p>}
                  </div>
                </div>

                {disqualifiers.length > 0 ? (
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-axiom-text-mute">Disqualifiers</p>
                    <div className="space-y-2">
                      {disqualifiers.map((reason: string, index: number) => (
                        <div key={`${reason}-${index}`} className="rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-300">
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="axiom-bento p-6">
              <CardHeader className="border-b border-axiom-border pb-4">
                <CardTitle className="text-xl">Operator Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-2">
                  <Label htmlFor="lead-contact-name">Contact Name</Label>
                  <Input id="lead-contact-name" onChange={(e) => setForm((current) => ({ ...current, contactName: e.target.value }))} value={form.contactName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-email">Email</Label>
                  <Input id="lead-email" onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} value={form.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-phone">Phone</Label>
                  <Input id="lead-phone" onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} value={form.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-note">Tactical Note</Label>
                  <textarea className="min-h-[120px] w-full rounded-xl border border-axiom-border bg-transparent px-3 py-3 text-sm text-axiom-text-main" id="lead-note" onChange={(e) => setForm((current) => ({ ...current, tacticalNote: e.target.value }))} value={form.tacticalNote} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-opener">Call Opener</Label>
                  <textarea className="min-h-[120px] w-full rounded-xl border border-axiom-border bg-transparent px-3 py-3 text-sm text-axiom-text-main" id="lead-opener" onChange={(e) => setForm((current) => ({ ...current, callOpener: e.target.value }))} value={form.callOpener} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-followup">Follow Up Question</Label>
                  <textarea className="min-h-[100px] w-full rounded-xl border border-axiom-border bg-transparent px-3 py-3 text-sm text-axiom-text-main" id="lead-followup" onChange={(e) => setForm((current) => ({ ...current, followUpQuestion: e.target.value }))} value={form.followUpQuestion} />
                </div>
                <label className="flex items-center gap-2 text-sm text-axiom-text-main">
                  <input checked={form.isArchived} onChange={(e) => setForm((current) => ({ ...current, isArchived: e.target.checked }))} type="checkbox" />
                  Mark archived
                </label>
                <button className="btn-primary btn-md w-full justify-center py-3 text-sm" disabled={saving} onClick={handleSave} type="button">
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Lead'}
                </button>
              </CardContent>
            </Card>

            <Card className="axiom-bento p-6">
              <CardHeader className="border-b border-axiom-border pb-4">
                <CardTitle className="text-xl">Live Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-5 text-sm">
                {lead.websiteUrl ? <a className="flex items-center gap-2 text-axiom-text-main hover:text-[var(--axiom-accent)]" href={lead.websiteUrl.startsWith('http') ? lead.websiteUrl : `https://${lead.websiteUrl}`} rel="noreferrer" target="_blank"><ExternalLink className="h-4 w-4" />Website</a> : null}
                {lead.socialLink ? <a className="flex items-center gap-2 text-axiom-text-main hover:text-[var(--axiom-accent)]" href={lead.socialLink} rel="noreferrer" target="_blank"><ExternalLink className="h-4 w-4" />Social Profile</a> : null}
                {lead.email ? <a className="flex items-center gap-2 text-axiom-text-main hover:text-[var(--axiom-accent)]" href={`mailto:${lead.email}`}><ExternalLink className="h-4 w-4" />Email</a> : null}
                {lead.phone ? <a className="flex items-center gap-2 text-axiom-text-main hover:text-[var(--axiom-accent)]" href={`tel:${lead.phone}`}><ExternalLink className="h-4 w-4" />Call</a> : null}
                <div className="rounded-xl border border-axiom-border px-4 py-3 text-xs text-axiom-text-mute">
                  Lead created {new Date(lead.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </OmniscientShell>
  )
}
