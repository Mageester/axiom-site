import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Search, Trash2 } from 'lucide-react'

import OmniscientShell from '../../components/admin/OmniscientShell'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { apiJson, errorMessage } from '../../lib/api'
import { buildQueryString, type OmniscientLead } from '../../lib/omniscient'

export default function Vault() {
  const [leads, setLeads] = useState<OmniscientLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState('S,A,B,C,D')
  const [city, setCity] = useState('')
  const [niche, setNiche] = useState('')
  const [includeArchived, setIncludeArchived] = useState(false)
  const [hasEmail, setHasEmail] = useState(false)
  const [noWebsite, setNoWebsite] = useState(false)

  const query = useMemo(() => buildQueryString({
    city: city || null,
    hasEmail: hasEmail || null,
    includeArchived: includeArchived || null,
    niche: niche || null,
    noWebsite: noWebsite || null,
    search: search || null,
    sort: 'axiomScore',
    sortDir: 'desc',
    tier,
  }), [city, hasEmail, includeArchived, niche, noWebsite, search, tier])

  const load = () => {
    setLoading(true)
    setError('')
    return apiJson<{ leads: OmniscientLead[] }>(`/api/omniscient/leads?${query}`, {
      credentials: 'include',
      timeoutMs: 20000,
    })
      .then((data) => setLeads(data.leads || []))
      .catch((err) => setError(errorMessage(err, 'Failed to load vault leads.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [query])

  const handleDelete = async (lead: OmniscientLead) => {
    const confirmed = window.confirm(`Delete ${lead.businessName}? This cannot be undone.`)
    if (!confirmed) return

    try {
      await apiJson(`/api/omniscient/leads/${lead.id}`, {
        credentials: 'include',
        method: 'DELETE',
        timeoutMs: 15000,
      })
      await load()
    } catch (err) {
      setError(errorMessage(err, 'Failed to delete lead.'))
    }
  }

  return (
    <OmniscientShell
      subtitle="Browse, filter, and export the secured Omniscient vault. All exports remain behind authenticated, server-side checks."
      title="The Vault"
      actions={
        <>
          <a className="btn-secondary btn-sm px-4 py-2 text-xs" href={`/api/omniscient/leads/export?${query}&format=csv`}>
            <Download className="mr-2 inline h-4 w-4" />
            CSV
          </a>
          <a className="btn-secondary btn-sm px-4 py-2 text-xs" href={`/api/omniscient/leads/export?${query}&format=xlsx`}>
            <Download className="mr-2 inline h-4 w-4" />
            XLSX
          </a>
        </>
      }
    >
      <Card className="axiom-bento p-5">
        <CardContent className="grid gap-3 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-axiom-text-mute" />
              <Input className="pl-10" onChange={(e) => setSearch(e.target.value)} placeholder="Search business, city, note, email..." value={search} />
            </div>
          </div>
          <Input onChange={(e) => setTier(e.target.value)} placeholder="Tier list (S,A,B)" value={tier} />
          <Input onChange={(e) => setCity(e.target.value)} placeholder="City" value={city} />
          <Input onChange={(e) => setNiche(e.target.value)} placeholder="Niche" value={niche} />
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-axiom-text-mute">
            <label className="flex items-center gap-2">
              <input checked={hasEmail} onChange={(e) => setHasEmail(e.target.checked)} type="checkbox" />
              Has Email
            </label>
            <label className="flex items-center gap-2">
              <input checked={noWebsite} onChange={(e) => setNoWebsite(e.target.checked)} type="checkbox" />
              No Website
            </label>
            <label className="flex items-center gap-2">
              <input checked={includeArchived} onChange={(e) => setIncludeArchived(e.target.checked)} type="checkbox" />
              Show Archived
            </label>
          </div>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Card className="axiom-bento overflow-hidden p-0">
        <CardHeader className="border-b border-axiom-border px-5 py-4">
          <CardTitle className="text-xl">Lead Database</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? <p className="px-5 py-8 text-sm text-axiom-text-mute">Loading secured lead records...</p> : null}
          {!loading && leads.length === 0 ? <p className="px-5 py-8 text-sm text-axiom-text-mute">No leads match the current filters.</p> : null}
          {!loading && leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-axiom-border bg-black/20 text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">
                  <tr>
                    <th className="px-4 py-3">Business</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Website</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-axiom-border/70 text-sm">
                      <td className="px-4 py-4">
                        <div className="font-medium text-axiom-text-main">{lead.businessName}</div>
                        <div className="text-xs uppercase tracking-[0.16em] text-axiom-text-mute">{lead.niche} • {lead.city}</div>
                        {lead.address ? <div className="mt-1 text-xs text-axiom-text-mute">{lead.address}</div> : null}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-axiom-text-main">{lead.axiomTier || '—'}</div>
                        <div className="text-xs text-axiom-text-mute">{lead.axiomScore ?? 0}/100</div>
                      </td>
                      <td className="px-4 py-4 text-xs text-axiom-text-mute">
                        <div>{lead.email || 'No email'}</div>
                        <div className="mt-1">{lead.phone || 'No phone'}</div>
                      </td>
                      <td className="px-4 py-4 text-xs text-axiom-text-mute">
                        <div>{lead.websiteStatus || 'Unknown'}</div>
                        <div className="mt-1">{lead.websiteGrade || '—'}</div>
                      </td>
                      <td className="px-4 py-4 text-xs text-axiom-text-mute">
                        {new Date(lead.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link className="rounded-lg border border-axiom-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-axiom-text-main" to={`/lead/${lead.id}`}>
                            Open
                          </Link>
                          <button
                            className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-300"
                            onClick={() => handleDelete(lead)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </OmniscientShell>
  )
}
