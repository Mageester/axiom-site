import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiRequestError, apiJson, errorMessage } from '../../lib/api';

const Campaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [form, setForm] = useState({ niche: '', city: '', radius: 10 });
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');

    const loadCampaigns = async () => {
        try {
            setError('');
            const data = await apiJson<{ campaigns?: any[] }>('/api/campaigns', { timeoutMs: 15000 });
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setCreateError('');
        setCreateSuccess('');
        try {
            const created = await apiJson<{ campaign_id?: string }>('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ niche: form.niche, city: form.city, radius_km: form.radius }),
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

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-subtle pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-primary tracking-tight">Intelligence Campaigns</h1>
                    <p className="text-[13px] text-secondary font-mono uppercase tracking-widest mt-2">{campaigns.length} Active Deployments</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form */}
                <div className="lg:col-span-4">
                    <form onSubmit={handleCreate} className="surface-panel p-6 sm:p-8 flex flex-col gap-6 rounded-sm relative">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                        <h2 className="text-[15px] font-semibold text-primary/90 mb-2">Deploy New Campaign</h2>
                        {createError ? <p className="text-[11px] font-mono text-red-400">{createError}</p> : null}
                        {createSuccess ? <p className="text-[11px] font-mono text-emerald-400">{createSuccess}</p> : null}

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Target Niche</label>
                            <input type="text" placeholder="e.g. hvac, plumbing, roofing" required value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-3 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Target City</label>
                            <input type="text" placeholder="e.g. Toronto, CA" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-3 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Radius (km)</label>
                            <input type="number" min="1" max="100" required value={form.radius} onChange={e => setForm({ ...form, radius: parseInt(e.target.value) })} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-3 focus-visible:border-accent/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] outline-none" />
                        </div>

                        <button disabled={creating} type="submit" className="w-full py-4 mt-2 bg-white text-black hover:bg-[#e2e2e2] active:scale-[0.99] text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px] disabled:opacity-50">
                            {creating ? 'Running...' : 'Run Discovery Job'}
                        </button>
                    </form>
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
                                    <Link to={`/leads?campaign_id=${c.id}`} className="px-5 py-2.5 bg-[#121417]/50 border border-white/10 hover:border-white/30 hover:bg-white/5 text-primary text-[11px] font-semibold tracking-[0.05em] uppercase transition-all duration-300 rounded-sm">
                                        View Pipeline
                                    </Link>
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
