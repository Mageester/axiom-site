import React, { useEffect, useState } from 'react'
import { Activity, Database, KeyRound, Shield, TimerReset } from 'lucide-react'

import OmniscientShell from '../../components/admin/OmniscientShell'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { apiJson, errorMessage } from '../../lib/api'
import type { OmniscientRuntimeStatus } from '../../lib/omniscient'

export default function OmniscientSettings() {
  const [status, setStatus] = useState<OmniscientRuntimeStatus | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiJson<OmniscientRuntimeStatus>('/api/omniscient/runtime', {
      credentials: 'include',
      timeoutMs: 15000,
    })
      .then((data) => {
        if (active) setStatus(data)
      })
      .catch((err) => {
        if (active) setError(errorMessage(err, 'Failed to load runtime status.'))
      })
    return () => {
      active = false
    }
  }, [])

  const statusRow = (label: string, value: React.ReactNode) => (
    <div className="flex items-center justify-between rounded-xl border border-axiom-border px-4 py-3 text-sm">
      <span className="text-axiom-text-mute">{label}</span>
      <span className="font-medium text-axiom-text-main">{value}</span>
    </div>
  )

  return (
    <OmniscientShell
      subtitle="Cloudflare-safe runtime status for the internal Omniscient deployment. Secrets remain server-side and are never editable from the browser."
      title="Settings"
    >
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="axiom-bento p-6">
          <CardHeader className="border-b border-axiom-border pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-[var(--axiom-accent)]" />
              Security Posture
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 pt-5">
            {statusRow('Gemini API key', status?.geminiConfigured ? 'Configured' : 'Missing')}
            {statusRow('Browser rendering', status?.browserRenderingConfigured ? 'Bound' : 'Local fallback')}
            {statusRow('Allowed users', status?.authAllowedCount ?? 0)}
            {statusRow('Admin users', status?.adminEmailCount ?? 0)}
            {statusRow('App base URL', status?.appBaseUrl || '—')}
          </CardContent>
        </Card>

        <Card className="axiom-bento p-6">
          <CardHeader className="border-b border-axiom-border pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="h-5 w-5 text-[var(--axiom-accent)]" />
              Runtime Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 pt-5">
            {statusRow('Database target', status?.databaseTarget || '—')}
            {statusRow('Export rate limit', status ? `${status.rateLimitMaxExport} / ${status.rateLimitWindowSeconds}s` : '—')}
            {statusRow('Scrape rate limit', status ? `${status.rateLimitMaxScrape} / ${status.rateLimitWindowSeconds}s` : '—')}
            {statusRow('Scrape concurrency', status?.scrapeConcurrencyLimit ?? '—')}
            {statusRow('Scrape timeout', status ? `${Math.round(status.scrapeTimeoutMs / 1000)}s` : '—')}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="axiom-bento p-5">
          <CardContent className="items-center justify-center text-center">
            <KeyRound className="mx-auto h-6 w-6 text-[var(--axiom-accent)]" />
            <p className="mt-3 text-sm text-axiom-text-main">Secrets stay server-side.</p>
            <p className="text-xs text-axiom-text-mute">No browser bundle or settings page exposes the Gemini key.</p>
          </CardContent>
        </Card>
        <Card className="axiom-bento p-5">
          <CardContent className="items-center justify-center text-center">
            <TimerReset className="mx-auto h-6 w-6 text-[var(--axiom-accent)]" />
            <p className="mt-3 text-sm text-axiom-text-main">Fail-closed controls.</p>
            <p className="text-xs text-axiom-text-mute">Export and scrape routes are both auth-checked and rate-limited.</p>
          </CardContent>
        </Card>
        <Card className="axiom-bento p-5">
          <CardContent className="items-center justify-center text-center">
            <Activity className="mx-auto h-6 w-6 text-[var(--axiom-accent)]" />
            <p className="mt-3 text-sm text-axiom-text-main">Audited activity.</p>
            <p className="text-xs text-axiom-text-mute">Login, scrape, export, delete, and lead edits are written to audit events.</p>
          </CardContent>
        </Card>
      </div>
    </OmniscientShell>
  )
}
