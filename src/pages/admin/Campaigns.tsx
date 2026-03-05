import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ApiRequestError, apiJson } from '../../lib/api';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"

function normalizeText(value: string) {
    return value.replace(/\s+/g, ' ').trim();
}

type Campaign = {
    id: string;
    niche: string;
    city: string;
    radius_km: number;
    mode?: 'strict' | 'opportunity';
    created_at: string;
    lead_count: number;
};

export default function Campaigns() {
    const [niche, setNiche] = useState("")
    const [city, setCity] = useState("")
    const [radius, setRadius] = useState("10")
    const [maxDepth, setMaxDepth] = useState("5")

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [logs, setLogs] = useState<string[]>([])
    const [csvPath, setCsvPath] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const abortControllerRef = useRef<AbortController | null>(null);
    const streamTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
        };
    }, []);

    // Auto-scroll terminal
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    const loadCampaigns = async () => {
        try {
            const data = await apiJson<{ campaigns?: Campaign[] }>('/api/campaigns', {
                timeoutMs: 15000,
                credentials: 'include'
            });
            setCampaigns(data.campaigns || []);
        } catch (err) {
            if (err instanceof ApiRequestError && (err.status === 401 || err.status === 403)) {
                window.location.href = '/admin/login';
            }
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    const requestScrapeToken = async (backendUrl: string, signal: AbortSignal) => {
        const tokenResponse = await fetch(`${backendUrl}/api/scrape/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal
        });

        if (!tokenResponse.ok) {
            throw new Error(`Auth token request failed (${tokenResponse.status})`);
        }

        const tokenBody = await tokenResponse.json().catch(() => ({}));
        if (!tokenBody?.token || typeof tokenBody.token !== 'string') {
            throw new Error('Scrape auth token missing from server response.');
        }

        return tokenBody.token as string;
    };

    const handleExtraction = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setCompleted(false)
        setLogs([])
        setCsvPath("")

        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const normalizedNiche = normalizeText(niche);
        const normalizedCity = normalizeText(city);

        setLogs(prev => [...prev, `[🚀] Starting ENGINE V2 Scrape: ${normalizedNiche} in ${normalizedCity} (Radius: ${radius}km, Depth: ${maxDepth})`]);

        if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
        streamTimeoutRef.current = setTimeout(() => {
            setLogs(prev => [...prev, '[⏳] System Warming Up... (Backend engine is booting, this can take up to 60s)']);
        }, 50000);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';
            const scrapeToken = await requestScrapeToken(backendUrl, controller.signal);
            const res = await fetch(`${backendUrl}/api/scrape?niche=${encodeURIComponent(normalizedNiche)}&city=${encodeURIComponent(normalizedCity)}&radius=${radius}&maxDepth=${maxDepth}`, {
                signal: controller.signal,
                headers: {
                    'Authorization': `Bearer ${scrapeToken}`
                }
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let firstChunkReceived = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;

                if (!firstChunkReceived && streamTimeoutRef.current) {
                    clearTimeout(streamTimeoutRef.current);
                    firstChunkReceived = true;
                }

                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.substring(6);
                            if (dataStr) {
                                try {
                                    const data = JSON.parse(dataStr);
                                    if (data.message) {
                                        setLogs(prev => [...prev, data.message]);
                                    }
                                    if (data.error) {
                                        setLogs(prev => [...prev, `[!!!] ERROR: ${data.error}`]);
                                        setLoading(false);
                                    }
                                    if (data._done) {
                                        setCompleted(true);
                                        setLoading(false);
                                        setCsvPath('C:\\Users\\riley\\.gemini\\antigravity\\scratch\\Lead_Database_No_Site.csv');
                                    }
                                } catch (e) {
                                    // Error parsing JSON string, likely incomplete stream chunk
                                }
                            }
                        }
                    }
                }
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setLogs(prev => [...prev, '[🛑] Stream terminated by user navigation.']);
            } else {
                setLogs(prev => [...prev, `[!!!] ERROR: ${err.message || 'Server request failed.'}`]);
            }
            setLoading(false);
        } finally {
            if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
        }
    }

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-axiom-border pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-axiom-text-main tracking-tight">Intelligence Campaigns</h1>
                    <p className="text-[13px] text-axiom-text-mute font-mono uppercase tracking-widest mt-2">{campaigns.length} Active Deployments</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/admin/inquiries" className="px-4 py-2 border border-axiom-border text-axiom-text-mute hover:text-axiom-text-main hover:border-axiom-border text-[10px] font-semibold tracking-widest uppercase rounded-sm">
                        Inquiries
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500">

                {/* Controls - The Omniscient Transplant */}
                <Card className="border-axiom-border bg-[#0a0c0e]">
                    <CardHeader>
                        <CardTitle className="text-2xl font-extrabold tracking-tight text-axiom-text-main">The Omniscient</CardTitle>
                        <CardDescription className="text-axiom-text-mute">
                            Deep-mine qualified prospects missing websites, analyze their digital footprint, and auto-export to CSV.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleExtraction} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="niche" className="font-semibold text-axiom-text-main">Niche / Profession</Label>
                                <Input
                                    id="niche" placeholder="e.g. Roofers, Concrete, Med-Spas"
                                    value={niche} onChange={(e) => setNiche(e.target.value)}
                                    required className="bg-transparent text-axiom-text-main border-axiom-border focus-visible:border-accent"
                                    disabled={loading}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="font-semibold text-axiom-text-main">Target City</Label>
                                    <Input
                                        id="city" placeholder="e.g. Cambridge, ON"
                                        value={city} onChange={(e) => setCity(e.target.value)}
                                        required className="bg-transparent text-axiom-text-main border-axiom-border focus-visible:border-accent"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="radius" className="font-semibold text-axiom-text-main">Radius (km)</Label>
                                    <Input
                                        id="radius" type="number"
                                        value={radius} onChange={(e) => setRadius(e.target.value)}
                                        required className="bg-transparent text-axiom-text-main border-axiom-border focus-visible:border-accent"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxDepth" className="font-semibold text-axiom-text-main">Max Scroll Depth</Label>
                                    <Input
                                        id="maxDepth" type="number" min="1" max="50"
                                        title="How deep to scroll in Maps (1 = fast, 15 = deep)"
                                        value={maxDepth} onChange={(e) => setMaxDepth(e.target.value)}
                                        required className="bg-transparent text-axiom-text-main border-axiom-border focus-visible:border-accent"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full font-bold text-md cursor-pointer hover:bg-[#e2e2e2]" disabled={loading}>
                                {loading ? "Streaming Extraction..." : "Commence Engine"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Live Terminal - The Omniscient Transplant */}
                <Card className="bg-[#050607] border-axiom-border shadow-xl overflow-hidden flex flex-col h-[500px]">
                    <CardHeader className="bg-[#080a0c] border-b border-axiom-border py-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <span className="ml-2 text-xs font-mono text-axiom-text-mute tracking-wider">OMNISCIENT_TERMINAL</span>
                        </div>
                    </CardHeader>
                    <CardContent
                        ref={scrollRef}
                        className="flex-1 p-4 overflow-y-auto font-mono text-xs sm:text-sm text-green-400 space-y-1"
                    >
                        {logs.length === 0 && !loading && (
                            <p className="text-axiom-text-mute/60">Waiting for commands...</p>
                        )}
                        {logs.map((log, i) => (
                            <div key={i} className="break-words">
                                {log.startsWith("[!!!]") ? <span className="text-red-500 font-bold">{log}</span> :
                                    log.startsWith("[✅]") ? <span className="text-emerald-400 font-bold">{log}</span> :
                                        log.startsWith("[✔]") ? <span className="text-axiom-text-mute">{log}</span> :
                                            log.startsWith("[💾]") ? <span className="text-cyan-400">{log}</span> :
                                                log}
                            </div>
                        ))}
                        {loading && (
                            <div className="animate-pulse text-axiom-text-mute/60 mt-2">_</div>
                        )}
                    </CardContent>
                    {completed && csvPath && (
                        <CardFooter className="bg-emerald-950/30 border-t border-emerald-900/30 py-3 block">
                            <h4 className="text-emerald-400 font-bold text-sm mb-1">Export Completed Safely</h4>
                            <p className="text-emerald-500/80 text-xs font-mono break-all">{csvPath}</p>
                            <a href={csvPath} className="inline-block text-center w-full mt-3 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300 py-2 rounded-md text-sm transition-colors">
                                Download CSV Payload
                            </a>
                        </CardFooter>
                    )}
                </Card>
            </div>

            {/* Legacy Dashboard Listing preserved */}
            <div className="mt-12 axiom-bento rounded-sm border border-axiom-border">
                {campaigns.map(c => (
                    <div key={c.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between group border-b border-axiom-border last:border-0 hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-[16px] font-semibold text-axiom-text-main">{c.city} • <span className="opacity-80 font-normal capitalize">{c.niche}</span></h3>
                                <span className="text-[9px] font-mono bg-accent/10 text-accent px-1.5 py-0.5 rounded-sm">{c.radius_km}km</span>
                            </div>
                            <p className="text-[12px] text-axiom-text-mute/60 font-mono tracking-wider">{new Date(c.created_at).toLocaleString()}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[18px] font-mono font-semibold text-axiom-text-main leading-none">{c.lead_count}</span>
                                <span className="text-[9px] font-mono text-axiom-text-mute uppercase tracking-widest">Leads Gathered</span>
                            </div>
                            <div className="flex gap-2">
                                <Link to={`/leads?campaign_id=${c.id}`} className="px-4 py-2 border border-axiom-border hover:border-axiom-border text-axiom-text-main text-[10px] font-semibold tracking-[0.05em] uppercase transition-all duration-300 rounded-sm bg-white/5">
                                    View Pipeline
                                </Link>
                                <a href={`/api/campaigns/${c.id}/export.outreach.csv`} className="px-4 py-2 border border-axiom-border hover:border-axiom-border text-axiom-text-mute text-[10px] font-semibold tracking-[0.05em] uppercase transition-all duration-300 rounded-sm bg-transparent">
                                    Outreach CSV
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}



