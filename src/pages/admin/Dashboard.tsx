import React, { useEffect, useState } from 'react'
import { Database, Globe, Mail, Phone, ShieldCheck, Star, TrendingUp, Zap } from 'lucide-react'

import OmniscientShell from '../../components/admin/OmniscientShell'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { apiJson, errorMessage } from '../../lib/api'
import type { OmniscientAnalytics, OmniscientStats } from '../../lib/omniscient'

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  hint: string
}) {
  return (
    <Card className="axiom-bento p-5">
      <CardContent className="gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-axiom-text-mute">{label}</span>
          <div className="rounded-xl border border-axiom-border p-2 text-[var(--axiom-accent)]">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="text-3xl font-semibold text-axiom-text-main">{value}</div>
        <p className="text-xs text-axiom-text-mute">{hint}</p>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<OmniscientAnalytics | null>(null)
  const [stats, setStats] = useState<OmniscientStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      apiJson<OmniscientAnalytics>('/api/omniscient/leads/analytics', { credentials: 'include', timeoutMs: 20000 }),
      apiJson<OmniscientStats>('/api/omniscient/leads/stats', { credentials: 'include', timeoutMs: 15000 }),
    ])
      .then(([analyticsData, statsData]) => {
        if (!active) return
        setAnalytics(analyticsData)
        setStats(statsData)
      })
      .catch((err) => {
        if (!active) return
        setError(errorMessage(err, 'Failed to load Omniscient analytics.'))
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <OmniscientShell
      subtitle="Live overview of the protected Omniscient lead database running inside the Axiom ops stack."
      title="Dashboard"
    >
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard hint="qualified records in the vault" icon={Database} label="Total Leads" value={analytics?.total ?? '—'} />
        <StatCard hint="public contactable inboxes" icon={Mail} label="With Email" value={analytics?.withEmail ?? '—'} />
        <StatCard hint="Ontario-callable numbers discovered" icon={Phone} label="With Phone" value={analytics?.withPhone ?? '—'} />
        <StatCard hint="average Axiom score across the vault" icon={ShieldCheck} label="Avg Score" value={analytics ? `${analytics.avgScore}/100` : '—'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="axiom-bento p-6 lg:col-span-2">
          <CardHeader className="border-b border-axiom-border pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-[var(--axiom-accent)]" />
              Lead Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-4">
              {[
                ['Raw Leads', analytics?.funnel.raw ?? 0, 100],
                ['AI Enriched', analytics?.funnel.enriched ?? 0, analytics?.funnel.raw ? (analytics.funnel.enriched / analytics.funnel.raw) * 100 : 0],
                ['Scored', analytics?.funnel.scored ?? 0, analytics?.funnel.raw ? (analytics.funnel.scored / analytics.funnel.raw) * 100 : 0],
                ['Contactable', analytics?.funnel.contactable ?? 0, analytics?.funnel.raw ? (analytics.funnel.contactable / analytics.funnel.raw) * 100 : 0],
              ].map(([label, value, width]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-axiom-text-mute">
                    <span>{label}</span>
                    <span>{Number(value).toLocaleString()}</span>
                  </div>
                  <div className="h-3 rounded-full bg-black/30">
                    <div
                      className="h-3 rounded-full bg-[linear-gradient(90deg,rgba(194,110,78,0.9),rgba(216,131,97,0.9))]"
                      style={{ width: `${Math.max(Number(width), 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="axiom-bento p-6">
          <CardHeader className="border-b border-axiom-border pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-5 w-5 text-[var(--axiom-accent)]" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 pt-5 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">New Leads</span>
              <strong className="text-axiom-text-main">{stats?.todayLeads ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">Emails Found</span>
              <strong className="text-axiom-text-main">{stats?.todayEmails ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">Callable</span>
              <strong className="text-axiom-text-main">{stats?.todayCallable ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">Tier S/A</span>
              <strong className="text-axiom-text-main">{stats?.todayTierSA ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">Archived Today</span>
              <strong className="text-axiom-text-main">{stats?.todayDisqualified ?? 0}</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="axiom-bento p-6">
          <CardHeader className="border-b border-axiom-border pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5 text-[var(--axiom-accent)]" />
              Top Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-3">
              {(analytics?.topLeads || []).slice(0, 8).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
                  <div>
                    <div className="font-medium text-axiom-text-main">{lead.businessName}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-axiom-text-mute">{lead.niche} • {lead.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-axiom-text-main">{lead.axiomScore ?? 0}</div>
                    <div className="text-xs text-axiom-text-mute">{lead.axiomTier || '—'} tier</div>
                  </div>
                </div>
              ))}
              {analytics && analytics.topLeads.length === 0 ? <p className="text-sm text-axiom-text-mute">No scored leads yet.</p> : null}
            </div>
          </CardContent>
        </Card>

        <Card className="axiom-bento p-6">
          <CardHeader className="border-b border-axiom-border pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Globe className="h-5 w-5 text-[var(--axiom-accent)]" />
              Coverage Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 pt-5 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">Missing Website</span>
              <strong className="text-axiom-text-main">{analytics?.missingWebsite ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">Active Website</span>
              <strong className="text-axiom-text-main">{analytics?.activeWebsite ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">Social Profiles</span>
              <strong className="text-axiom-text-main">{analytics?.withSocial ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">Avg Rating</span>
              <strong className="text-axiom-text-main">{analytics?.avgRating?.toFixed(1) ?? '0.0'}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3">
              <span className="text-axiom-text-mute">Email Rate</span>
              <strong className="text-axiom-text-main">{analytics?.emailRate ?? 0}%</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </OmniscientShell>
  )
}
