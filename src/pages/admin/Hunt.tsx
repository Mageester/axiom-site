import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Download, Play, Target } from 'lucide-react'

import OmniscientShell from '../../components/admin/OmniscientShell'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { errorMessage } from '../../lib/api'
import { buildQueryString } from '../../lib/omniscient'

const NICHE_PRESETS = ['Roofers', 'Concrete', 'Med-Spas', 'Landscaping', 'Plumbing', 'HVAC']
const CITY_PRESETS = ['Kitchener', 'Waterloo', 'Cambridge', 'Guelph', 'Hamilton', 'London']

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export default function Hunt() {
  const [niche, setNiche] = useState('')
  const [city, setCity] = useState('')
  const [radius, setRadius] = useState('10')
  const [maxDepth, setMaxDepth] = useState('5')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState('')
  const [summary, setSummary] = useState<{ leadsFound: number; withEmail: number; avgScore?: number } | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const exportQuery = useMemo(() => buildQueryString({
    city: city || null,
    format: 'csv',
    niche: niche || null,
    tier: 'S,A,B',
  }), [city, niche])

  const exportXlsxQuery = useMemo(() => buildQueryString({
    city: city || null,
    format: 'xlsx',
    niche: niche || null,
    tier: 'S,A,B',
  }), [city, niche])

  const handleRun = async (event: React.FormEvent) => {
    event.preventDefault()
    const safeNiche = normalizeText(niche)
    const safeCity = normalizeText(city)
    if (!safeNiche || !safeCity) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError('')
    setSummary(null)
    setLogs([`[ENGINE] Queue armed for ${safeNiche} in ${safeCity}`])

    const query = buildQueryString({
      city: safeCity,
      maxDepth,
      niche: safeNiche,
      radius,
    })

    try {
      const response = await fetch(`/api/omniscient/scrape?${query}`, {
        credentials: 'include',
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        const raw = await response.text()
        throw new Error(raw || `Scrape request failed (${response.status})`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const chunks = buffer.split('\n\n')
        buffer = chunks.pop() || ''

        for (const chunk of chunks) {
          const line = chunk
            .split('\n')
            .find((entry) => entry.startsWith('data: '))
          if (!line) continue

          try {
            const payload = JSON.parse(line.slice(6)) as { message?: string; error?: string; _done?: boolean; stats?: { leadsFound: number; withEmail: number; avgScore?: number } }
            if (payload.message) {
              setLogs((current) => [...current, payload.message!])
            }
            if (payload.stats) {
              setSummary(payload.stats)
            }
            if (payload.error) {
              throw new Error(payload.error)
            }
          } catch (parseErr) {
            if (parseErr instanceof Error) {
              throw parseErr
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setLogs((current) => [...current, '[ENGINE] Run canceled'])
      } else {
        const message = errorMessage(err, 'Scrape failed.')
        setError(message)
        setLogs((current) => [...current, `[ERROR] ${message}`])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    abortRef.current?.abort()
    setLoading(false)
  }

  return (
    <OmniscientShell
      subtitle="Run protected Gemini-backed Google Maps extraction directly inside ops.getaxiom.ca. Results stay server-side in D1 and export from the secured vault."
      title="The Hunt"
      actions={
        <>
          <a className="btn-secondary btn-sm px-4 py-2 text-xs" href={`/api/omniscient/leads/export?${exportQuery}`}>CSV Export</a>
          <a className="btn-secondary btn-sm px-4 py-2 text-xs" href={`/api/omniscient/leads/export?${exportXlsxQuery}`}>XLSX Export</a>
        </>
      }
    >
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="grid gap-4 xl:grid-cols-[420px,minmax(0,1fr)]">
        <Card className="axiom-bento p-6">
          <CardHeader className="border-b border-axiom-border pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-5 w-5 text-[var(--axiom-accent)]" />
              Extraction Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form className="space-y-5" onSubmit={handleRun}>
              <div className="space-y-2">
                <Label htmlFor="hunt-niche">Niche / Profession</Label>
                <Input disabled={loading} id="hunt-niche" onChange={(e) => setNiche(e.target.value)} placeholder="Roofers, med-spas, landscapers..." value={niche} />
                <div className="flex flex-wrap gap-2">
                  {NICHE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      className="rounded-full border border-axiom-border px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-axiom-text-mute transition-colors hover:text-axiom-text-main"
                      onClick={() => setNiche(preset)}
                      type="button"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hunt-city">Target City</Label>
                <Input disabled={loading} id="hunt-city" onChange={(e) => setCity(e.target.value)} placeholder="Kitchener, Waterloo, Cambridge..." value={city} />
                <div className="flex flex-wrap gap-2">
                  {CITY_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      className="rounded-full border border-axiom-border px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-axiom-text-mute transition-colors hover:text-axiom-text-main"
                      onClick={() => setCity(preset)}
                      type="button"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hunt-radius">Radius (km)</Label>
                  <Input disabled={loading} id="hunt-radius" min="1" onChange={(e) => setRadius(e.target.value)} type="number" value={radius} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hunt-depth">Scroll Depth</Label>
                  <Input disabled={loading} id="hunt-depth" max="20" min="1" onChange={(e) => setMaxDepth(e.target.value)} type="number" value={maxDepth} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button disabled={loading} size="md" type="submit">
                  <Play className="mr-2 h-4 w-4" />
                  {loading ? 'Running...' : 'Run Extraction'}
                </Button>
                <Button disabled={!loading} onClick={handleCancel} size="md" type="button" variant="secondary">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="axiom-bento flex min-h-[560px] flex-col p-0">
          <CardHeader className="border-b border-axiom-border px-6 py-4">
            <CardTitle className="text-xl">Operator Terminal</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 px-6 py-5">
            <div
              className="h-full min-h-[420px] overflow-y-auto rounded-2xl border border-axiom-border bg-black/50 p-4 font-mono text-xs text-emerald-400"
              ref={terminalRef}
            >
              {logs.length === 0 ? <p className="text-axiom-text-mute">Waiting for extraction commands...</p> : null}
              {logs.map((entry, index) => (
                <div key={`${entry}-${index}`} className="mb-2 break-words">
                  {entry}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t border-axiom-border px-6 py-4">
            <div className="text-xs text-axiom-text-mute">
              {summary ? `${summary.leadsFound} leads saved • ${summary.withEmail} with email • avg score ${summary.avgScore ?? 0}` : 'No completed run yet'}
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="btn-secondary btn-sm flex items-center gap-2 px-4 py-2 text-xs" href={`/api/omniscient/leads/export?${exportQuery}`}>
                <Download className="h-4 w-4" />
                Export CSV
              </a>
              <a className="btn-secondary btn-sm flex items-center gap-2 px-4 py-2 text-xs" href={`/api/omniscient/leads/export?${exportXlsxQuery}`}>
                <Download className="h-4 w-4" />
                Export XLSX
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </OmniscientShell>
  )
}
