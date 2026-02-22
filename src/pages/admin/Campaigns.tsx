import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiRequestError, apiJson, errorMessage } from '../../lib/api';

type Campaign = {
    id: string;
    niche: string;
    city: string;
    radius_km: number;
    created_at: string;
    lead_count: number;
};

type RunResponse = {
    msg?: string;
    processed?: number;
    log?: string[];
};

function normalizeText(value: string) {
    return value.replace(/\s+/g, ' ').trim();
}

function validateNiche(value: string) {
    const normalized = normalizeText(value);
    if (!normalized) return 'Target niche is required';
    if (normalized.length < 2) return 'Target niche must be at least 2 characters';
    if (normalized.length > 60) return 'Target niche must be 60 characters or less';
    return '';
}

function validateCity(value: string) {
    const normalized = normalizeText(value);
    if (!normalized) return 'Target city is required';
    if (!/^[^,]{2,60},\s*[A-Za-z .'-]{2,30}$/.test(normalized)) {
        return 'Use format: City, Province/State (example: Toronto, ON)';
    }
    return '';
}

const Campaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [form, setForm] = useState({ niche: '', city: '', radius: 10 });
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [actionBusyId, setActionBusyId] = useState<string | null>(null);
    const [actionError, setActionError] = useState('');
    const [deleteAllOpen, setDeleteAllOpen] = useState(false);
    const [deleteAllConfirm, setDeleteAllConfirm] = useState('');
    const [deleteAllBusy, setDeleteAllBusy] = useState(false);

    const [runStatus, setRunStatus] = useState('');
    const [runProcessed, setRunProcessed] = useState<number | null>(null);
    const [recentRunLog, setRecentRunLog] = useState<string[]>([]);
    const [pollJobsActive, setPollJobsActive] = useState(false);

    const normalizedForm = useMemo(() => ({
        niche: normalizeText(form.niche),
        city: normalizeText(form.city),
        radius: Number.isFinite(form.radius) ? form.radius : 10
    }), [form]);
    const nicheError = validateNiche(form.niche);
    const cityError = validateCity(form.city);
    const radiusError = Number.isFinite(form.radius) && form.radius >= 1 && form.radius <= 100 ? '' : 'Radius must be between 1 and 100 km';
    const formValid = !nicheError && !cityError && !radiusError;

    const loadCampaigns = async () => {
        try {
            setError('');
            const data = await apiJson<{ campaigns?: Campaign[] }>('/api/campaigns', {
                timeoutMs: 15000,
                credentials: 'include'
            });
            setCampaigns(data.campaigns || []);
        } catch (err) {
            if (err instanceof ApiRequestError && (err.status === 401 || err.status === 403)) {
                window.location.href = '/login';
                return;
            }
            setError(errorMessage(err, 'Failed to load campaigns.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    useEffect(() => {
        if (!pollJobsActive) return;
        let cancelled = false;
        const tick = async () => {
            try {
                const data = await apiJson<{ jobs?: Array<{ status: string }>; stats?: Array<{ status: string; c: number }> }>('/api/jobs', {
                    timeoutMs: 15000,
                    credentials: 'include'
                });
                if (cancelled) return;
                const jobs = data.jobs || [];
                const hasRunning = jobs.some(j => j.status === 'running');
                const queued = jobs.filter(j => j.status === 'queued').length;
                setRunStatus(hasRunning ? 'Job runner active…' : (queued > 0 ? `Queued jobs remaining: ${queued}` : 'Queue idle.'));
                if (!hasRunning) setPollJobsActive(false);
            } catch {
                if (!cancelled) setPollJobsActive(false);
            }
        };

        tick();
        const id = window.setInterval(tick, 2000);
        return () => {
            cancelled = true;
            window.clearInterval(id);
        };
    }, [pollJobsActive]);

    const applyRunResult = (runRes: RunResponse, prefix?: string) => {
        const log = Array.isArray(runRes.log) ? runRes.log : [];
        setRunStatus(`${prefix ? `${prefix}. ` : ''}${runRes.msg || 'Queue executed.'}`);
        setRunProcessed(typeof runRes.processed === 'number' ? runRes.processed : null);
        setRecentRunLog(log);
        setPollJobsActive(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValid) {
            setCreateError(nicheError || cityError || radiusError || 'Invalid input');
            return;
        }
        setCreating(true);
        setCreateError('');
        setCreateSuccess('');
        setActionError('');
        try {
            const created = await apiJson<{ campaign_id?: string }>('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ niche: normalizedForm.niche, city: normalizedForm.city, radius_km: normalizedForm.radius }),
                credentials: 'include',
                timeoutMs: 20000
            });

            let runRes: { msg?: string; processed?: number; log?: string[] } | null = null;
            try {
                runRes = await apiJson<{ msg?: string; processed?: number; log?: string[] }>('/api/jobs/run', {
                    method: 'POST',
                    credentials: 'include',
                    timeoutMs: 30000
                });
            } catch (runErr) {
                if (runErr instanceof ApiRequestError && (runErr.status === 401 || runErr.status === 403)) {
                    window.location.href = '/login';
                    return;
                }
                setCreateError(
                    `Campaign created${created.campaign_id ? ` (${created.campaign_id})` : ''}, but running discovery failed: ${errorMessage(runErr, 'Unable to run jobs.')}`
                );
                setForm({ niche: '', city: '', radius: 10 });
                await loadCampaigns();
                return;
            }

            applyRunResult(runRes, 'Discovery trigger sent');
            setCreateSuccess(
                `Campaign created${created.campaign_id ? ` (${created.campaign_id})` : ''}. ${runRes?.msg || 'Queue executed.'} ${typeof runRes?.processed === 'number' ? `Processed: ${runRes.processed}.` : ''}`.trim()
            );
            setForm({ niche: '', city: '', radius: 10 });
            await loadCampaigns();
        } catch (err) {
            if (err instanceof ApiRequestError && (err.status === 401 || err.status === 403)) {
                window.location.href = '/login';
                return;
            }
            setCreateError(errorMessage(err, 'Failed to create campaign.'));
        } finally {
            setCreating(false);
        }
    };

    const handleRunAgain = async (campaign: Campaign) => {
        setActionBusyId(`run:${campaign.id}`);
        setActionError('');
        setCreateSuccess('');
        try {
            const runRes = await apiJson<RunResponse>('/api/jobs/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ campaign_id: campaign.id }),
                credentials: 'include',
                timeoutMs: 30000
            });
            applyRunResult(runRes, `Rerun requested for ${campaign.city}`);
            await loadCampaigns();
        } catch (err) {
            if (err instanceof ApiRequestError && (err.status === 401 || err.status === 403)) {
                window.location.href = '/login';
                return;
            }
            setActionError(`Failed to run discovery for ${campaign.city}: ${errorMessage(err, 'Unable to run jobs.')}`);
        } finally {
            setActionBusyId(null);
        }
    };

    const handleDeleteCampaign = async (campaign: Campaign) => {
        const confirmed = window.confirm(`Delete campaign "${campaign.city} • ${campaign.niche}" and related leads/jobs?`);
        if (!confirmed) return;
        setActionBusyId(`delete:${campaign.id}`);
        setActionError('');
        try {
            await apiJson(`/api/campaigns/${campaign.id}`, {
                method: 'DELETE',
                credentials: 'include',
                timeoutMs: 30000
            });
            setRunStatus(`Deleted campaign ${campaign.city} • ${campaign.niche}`);
            setRunProcessed(null);
            setRecentRunLog([]);
            await loadCampaigns();
        } catch (err) {
            if (err instanceof ApiRequestError && (err.status === 401 || err.status === 403)) {
                window.location.href = '/login';
                return;
            }
            setActionError(`Delete failed: ${errorMessage(err, 'Unable to delete campaign.')}`);
        } finally {
            setActionBusyId(null);
        }
    };

    const handleDeleteAll = async () => {
        if (deleteAllConfirm !== 'DELETE') return;
        setDeleteAllBusy(true);
        setActionError('');
        try {
            await apiJson('/api/campaigns', {
                method: 'DELETE',
                credentials: 'include',
                timeoutMs: 30000
            });
            setDeleteAllOpen(false);
            setDeleteAllConfirm('');
            setRunStatus('All campaigns deleted');
            setRunProcessed(null);
            setRecentRunLog([]);
            await loadCampaigns();
        } catch (err) {
            if (err instanceof ApiRequestError && (err.status === 401 || err.status === 403)) {
                window.location.href = '/login';
                return;
            }
            setActionError(`Delete all failed: ${errorMessage(err, 'Unable to delete all campaigns.')}`);
        } finally {
            setDeleteAllBusy(false);
        }
    };

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-subtle pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-primary tracking-tight">Intelligence Campaigns</h1>
                    <p className="text-[13px] text-secondary font-mono uppercase tracking-widest mt-2">{campaigns.length} Active Deployments</p>
                </div>
                <button
                    type="button"
                    onClick={() => setDeleteAllOpen(v => !v)}
                    className="px-4 py-2 border border-red-500/30 text-red-300 hover:bg-red-500/10 text-[10px] font-semibold tracking-widest uppercase rounded-sm"
                >
                    Delete All Campaigns
                </button>
            </div>

            {deleteAllOpen ? (
                <div className="surface-panel p-4 mb-6 border border-red-500/30">
                    <p className="text-[11px] font-mono text-red-300 mb-3">Type `DELETE` to remove all campaigns, leads, audits, and pipeline jobs.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={deleteAllConfirm}
                            onChange={e => setDeleteAllConfirm(e.target.value)}
                            placeholder="Type DELETE"
                            className="bg-[#070708] border border-white/10 text-primary text-[13px] p-3 rounded-[2px] outline-none font-mono flex-1"
                        />
                        <button
                            type="button"
                            disabled={deleteAllBusy || deleteAllConfirm !== 'DELETE'}
                            onClick={handleDeleteAll}
                            className="px-4 py-3 bg-red-500/20 border border-red-500/40 text-red-200 text-[11px] font-semibold uppercase tracking-widest rounded-sm disabled:opacity-50"
                        >
                            {deleteAllBusy ? 'Deleting…' : 'Confirm Delete All'}
                        </button>
                    </div>
                </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form */}
                <div className="lg:col-span-4">
                    <form onSubmit={handleCreate} className="surface-panel p-6 sm:p-8 flex flex-col gap-6 rounded-sm relative">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                        <h2 className="text-[15px] font-semibold text-primary/90 mb-2">Deploy New Campaign</h2>
                        {createError ? <p className="text-[11px] font-mono text-red-400">{createError}</p> : null}
                        {createSuccess ? <p className="text-[11px] font-mono text-emerald-400">{createSuccess}</p> : null}
                        {actionError ? <p className="text-[11px] font-mono text-red-400">{actionError}</p> : null}

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Target Niche</label>
                            <input type="text" placeholder="e.g. hvac, plumbing, roofing" required value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-3 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none" />
                            <p className="text-[10px] font-mono text-secondary/60">2–60 chars. Spaces are normalized automatically.</p>
                            {nicheError ? <p className="text-[10px] font-mono text-red-400">{nicheError}</p> : null}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Target City</label>
                            <input type="text" placeholder="e.g. Toronto, ON" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-3 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none" />
                            <p className="text-[10px] font-mono text-secondary/60">Use `City, Province/State` (examples: `Toronto, ON`, `Dallas, TX`).</p>
                            {cityError ? <p className="text-[10px] font-mono text-red-400">{cityError}</p> : null}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Radius (km)</label>
                            <input type="number" min="1" max="100" required value={form.radius} onChange={e => setForm({ ...form, radius: Number.parseInt(e.target.value || '0', 10) })} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-3 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none" />
                            {radiusError ? <p className="text-[10px] font-mono text-red-400">{radiusError}</p> : null}
                        </div>

                        <button disabled={creating || !formValid} type="submit" className="w-full py-4 mt-2 bg-white text-black hover:bg-[#e2e2e2] active:scale-[0.99] text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px] disabled:opacity-50">
                            {creating ? 'Running...' : 'Run Discovery Job'}
                        </button>
                    </form>

                    <div className="surface-panel p-5 mt-6 rounded-sm border border-subtle">
                        <h3 className="text-[11px] font-mono uppercase tracking-widest text-secondary mb-3">Recent Run Status</h3>
                        <p className="text-[12px] text-primary">{runStatus || 'No recent run yet.'}</p>
                        {runProcessed !== null ? <p className="text-[11px] font-mono text-secondary mt-2">Processed: {runProcessed}</p> : null}
                        {recentRunLog.length > 0 ? (
                            <div className="mt-4 bg-black/30 border border-white/5 rounded-sm p-3">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-secondary/70 mb-2">Recent Run Log</p>
                                <div className="max-h-48 overflow-auto space-y-1">
                                    {[...recentRunLog.slice(0, 6), ...(recentRunLog.length > 12 ? ['...'] : []), ...recentRunLog.slice(-6)].map((line, idx) => (
                                        <p key={`${idx}-${line}`} className="text-[10px] font-mono text-secondary break-words">{line}</p>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    {error ? <p className="text-red-400 font-mono text-[12px]">{error}</p> : null}
                    {loading ? <p className="text-secondary font-mono text-[12px]">Fetching telemetry...</p> :
                        campaigns.map(c => (
                            <div key={c.id} className="surface-panel p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-white/20 transition-all">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-[16px] font-semibold text-primary">{c.city} • <span className="opacity-80 font-normal capitalize">{c.niche}</span></h3>
                                        <span className="text-[9px] font-mono bg-accent/10 text-accent px-1.5 py-0.5 rounded-sm">{c.radius_km}km</span>
                                    </div>
                                    <p className="text-[12px] text-secondary/60 font-mono tracking-wider">{new Date(c.created_at).toLocaleString()}</p>
                                </div>
                                <div className="mt-4 sm:mt-0 flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[18px] font-mono font-semibold text-primary leading-none">{c.lead_count}</span>
                                        <span className="text-[9px] font-mono text-secondary uppercase tracking-widest">Leads Gathered</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Link to={`/leads?campaign_id=${c.id}`} className="px-4 py-2.5 bg-[#121417]/50 border border-white/10 hover:border-white/30 hover:bg-white/5 text-primary text-[10px] font-semibold tracking-[0.05em] uppercase transition-all duration-300 rounded-sm text-center">
                                            View Pipeline
                                        </Link>
                                        <button
                                            type="button"
                                            disabled={actionBusyId !== null}
                                            onClick={() => handleRunAgain(c)}
                                            className="px-4 py-2.5 border border-accent/30 text-accent hover:bg-accent/10 text-[10px] font-semibold tracking-[0.05em] uppercase rounded-sm disabled:opacity-50"
                                        >
                                            {actionBusyId === `run:${c.id}` ? 'Running…' : 'Run Again'}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={actionBusyId !== null}
                                            onClick={() => handleDeleteCampaign(c)}
                                            className="px-4 py-2.5 border border-red-500/30 text-red-300 hover:bg-red-500/10 text-[10px] font-semibold tracking-[0.05em] uppercase rounded-sm disabled:opacity-50"
                                        >
                                            {actionBusyId === `delete:${c.id}` ? 'Deleting…' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Campaigns;
