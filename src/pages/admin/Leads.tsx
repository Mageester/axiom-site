import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ApiRequestError, apiJson, errorMessage } from '../../lib/api';

type SortBy = 'opportunity' | 'quality' | 'newest' | 'status';
type QuickFilter =
    | 'all'
    | 'ready-to-contact'
    | 'no-website'
    | 'website-unreachable'
    | 'verified-live'
    | 'high-opportunity'
    | 'high-quality'
    | 'missing-intake'
    | 'missing-booking';

function csvEsc(v: unknown) {
    const s = String(v ?? '');
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

function tagsFromLead(lead: any): string[] {
    return String(lead?.tags_csv || '')
        .split('|')
        .map((v) => v.trim())
        .filter(Boolean);
}

const Leads: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [leads, setLeads] = useState<any[]>([]);
    const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('opportunity');
    const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
    const [tagFilter, setTagFilter] = useState('');
    const [showDuplicates, setShowDuplicates] = useState(false);
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [bulkBusy, setBulkBusy] = useState(false);
    const [bulkError, setBulkError] = useState('');
    const [bulkMessage, setBulkMessage] = useState('');
    const [bulkStatus, setBulkStatus] = useState('contacted');
    const [bulkTagName, setBulkTagName] = useState('');

    const campaignId = searchParams.get('campaign_id');
    const statusFilter = searchParams.get('status');

    const load = async () => {
        let url = '/api/leads';
        const params = new URLSearchParams();
        if (campaignId) params.append('campaign_id', campaignId);
        if (statusFilter) params.append('status', statusFilter);
        if (showDuplicates) params.append('include_duplicates', '1');
        if (params.toString()) url += '?' + params.toString();

        setLoading(true);
        setError('');
        try {
            const [leadData, tagData] = await Promise.all([
                apiJson<{ leads?: any[] }>(url, { timeoutMs: 20000, credentials: 'include' }),
                apiJson<{ tags?: any[] }>('/api/tags', { timeoutMs: 15000, credentials: 'include' }).catch(() => ({ tags: [] as any[] }))
            ]);
            setLeads(leadData.leads || []);
            setTags((tagData.tags || []).map((t: any) => ({ id: String(t.id), name: String(t.name) })));
            setSelected({});
        } catch (err) {
            if (err instanceof ApiRequestError && (err.status === 401 || err.status === 403)) {
                window.location.href = '/admin/login';
                return;
            }
            setError(errorMessage(err, 'Failed to load leads.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [campaignId, statusFilter, showDuplicates]);

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            if (tagFilter && !tagsFromLead(lead).includes(tagFilter)) return false;
            if (quickFilter === 'ready-to-contact') {
                const hasContact = !!lead.phone || !!lead.detected_email;
                return hasContact && Number(lead.dnc || 0) === 0;
            }
            if (quickFilter === 'no-website') return !lead.canonical_url;
            if (quickFilter === 'website-unreachable') return String(lead.website_verified || '') === 'unreachable';
            if (quickFilter === 'verified-live') return String(lead.website_verified || '') === 'confirmed_live';
            if (quickFilter === 'missing-intake') return Number(lead.intake_present || 0) === 0;
            if (quickFilter === 'missing-booking') return Number(lead.booking_present || 0) === 0;
            if (quickFilter === 'high-opportunity') return Number(lead.opportunity_score || 0) >= 15;
            if (quickFilter === 'high-quality') return Number(lead.lead_quality_score || 0) >= 40;
            return true;
        });
    }, [leads, quickFilter, tagFilter]);

    const sortedLeads = useMemo(() => {
        return [...filteredLeads].sort((a, b) => {
            if (sortBy === 'status') return String(a.status || '').localeCompare(String(b.status || ''));
            if (sortBy === 'newest') return String(b.last_audit_at || b.created_at || '').localeCompare(String(a.last_audit_at || a.created_at || ''));
            if (sortBy === 'quality') return Number(b.lead_quality_score || 0) - Number(a.lead_quality_score || 0);
            return Number(b.opportunity_score || 0) - Number(a.opportunity_score || 0);
        });
    }, [filteredLeads, sortBy]);

    const selectedIds = useMemo(() => sortedLeads.filter((l) => selected[l.id]).map((l) => l.id), [sortedLeads, selected]);

    const toggleSelectAllVisible = () => {
        const allSelected = sortedLeads.length > 0 && sortedLeads.every((l) => selected[l.id]);
        const next = { ...selected };
        for (const lead of sortedLeads) next[lead.id] = !allSelected;
        setSelected(next);
    };

    const refreshAndMessage = async (msg: string) => {
        setBulkMessage(msg);
        setBulkError('');
        await load();
    };

    const runBulkAction = async (payload: any) => {
        if (!selectedIds.length) {
            setBulkError('Select at least one lead.');
            return;
        }
        setBulkBusy(true);
        setBulkError('');
        setBulkMessage('');
        try {
            await apiJson('/api/leads/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead_ids: selectedIds, ...payload }),
                credentials: 'include',
                timeoutMs: 30000
            });
            await refreshAndMessage(`Updated ${selectedIds.length} lead(s).`);
        } catch (err) {
            setBulkError(errorMessage(err, 'Bulk action failed.'));
        } finally {
            setBulkBusy(false);
        }
    };

    const exportSelectedCsv = () => {
        if (!selectedIds.length) {
            setBulkError('Select leads to export.');
            return;
        }
        const selectedRows = sortedLeads.filter((l) => selected[l.id]);
        const header = ['name', 'phone', 'email', 'website', 'city', 'opportunity_score', 'quality_score', 'status', 'dnc', 'tags', 'notes'];
        const rows = selectedRows.map((l) => [
            l.name,
            l.phone,
            l.detected_email,
            l.canonical_url,
            campaignId || '',
            l.opportunity_score ?? 0,
            l.lead_quality_score ?? 0,
            l.status,
            Number(l.dnc || 0) ? '1' : '0',
            tagsFromLead(l).join('|'),
            l.notes || ''
        ].map(csvEsc).join(','));
        const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = `selected-leads${campaignId ? `-${campaignId}` : ''}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(href);
        setBulkMessage(`Exported ${selectedRows.length} selected lead(s).`);
    };

    const toggleLeadDnc = async (lead: any) => {
        try {
            await apiJson(`/api/leads/${lead.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dnc: !Number(lead.dnc || 0), dnc_reason: !Number(lead.dnc || 0) ? 'Operator quick action' : null }),
                credentials: 'include',
                timeoutMs: 15000
            });
            await load();
        } catch (err) {
            setBulkError(errorMessage(err, 'Failed to update DNC.'));
        }
    };

    const websiteLabel = (lead: any) => {
        if (lead.canonical_url) return null;
        if (lead.website_status === 'confirmed_missing') return 'None';
        return 'Unknown';
    };

    const websiteSourceBadge = (lead: any) => {
        if (!lead.website_source) return null;
        const label = lead.website_source === 'nominatim' ? 'Nominatim' : lead.website_source === 'inferred_email' ? 'Email' : 'OSM';
        return <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border border-axiom-border text-axiom-text-mute rounded-sm ml-2">{label}</span>;
    };

    const websiteVerifiedBadge = (lead: any) => {
        const status = String(lead.website_verified || 'unknown');
        if (!lead.canonical_url && status === 'unknown') return null;
        const label = status === 'confirmed_live' ? 'Live' : status === 'unreachable' ? 'Unreachable' : status === 'invalid_format' ? 'Invalid' : 'Unknown';
        const cls = status === 'confirmed_live'
            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
            : status === 'unreachable'
                ? 'border-red-500/30 text-red-400 bg-red-500/10'
                : 'border-axiom-border text-axiom-text-mute';
        return <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border rounded-sm ml-2 ${cls}`}>{label}</span>;
    };

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1280px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-axiom-border pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-axiom-text-main tracking-tight">Lead Intelligence Pipeline</h1>
                    <p className="text-[13px] text-axiom-text-mute font-mono uppercase tracking-widest mt-2">{sortedLeads.length} Targets Visible</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap justify-end">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)} className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[11px] p-2 rounded-[2px] font-mono">
                        <option value="opportunity">Sort: Opportunity</option>
                        <option value="quality">Sort: Quality</option>
                        <option value="newest">Sort: Newest</option>
                        <option value="status">Sort: Status</option>
                    </select>
                    <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[11px] p-2 rounded-[2px] font-mono">
                        <option value="">All Tags</option>
                        {tags.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                    <button type="button" onClick={() => setShowDuplicates(v => !v)} className={`px-3 py-2 text-[10px] font-mono uppercase tracking-widest border rounded-sm ${showDuplicates ? 'border-accent/40 text-accent bg-accent/10' : 'border-axiom-border text-axiom-text-mute'}`}>
                        {showDuplicates ? 'Hiding Duplicates' : 'Show Duplicates'}
                    </button>
                    <Link to="/campaigns" className="text-[11px] font-mono text-axiom-text-mute hover:text-axiom-text-main uppercase tracking-widest transition-colors">â† Back to Campaigns</Link>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {[
                    ['all', 'All'],
                    ['ready-to-contact', 'Ready To Contact'],
                    ['no-website', 'No Website'],
                    ['website-unreachable', 'Website Unreachable'],
                    ['verified-live', 'Verified Live'],
                    ['high-opportunity', 'High Opportunity'],
                    ['high-quality', 'High Quality'],
                    ['missing-intake', 'Missing Intake'],
                    ['missing-booking', 'Missing Booking']
                ].map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setQuickFilter(value as QuickFilter)}
                        className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border rounded-sm ${quickFilter === value ? 'border-accent/40 text-accent bg-accent/10' : 'border-axiom-border text-axiom-text-mute'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="axiom-bento p-4 mb-6 border border-axiom-border">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={toggleSelectAllVisible} className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest border border-axiom-border rounded-sm text-axiom-text-mute hover:text-axiom-text-main">
                            {sortedLeads.length > 0 && sortedLeads.every(l => selected[l.id]) ? 'Unselect Visible' : 'Select Visible'}
                        </button>
                        <span className="text-[10px] font-mono text-axiom-text-mute uppercase tracking-widest">{selectedIds.length} Selected</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)} className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[11px] p-2 rounded-[2px] font-mono">
                            <option value="new">Mark New</option>
                            <option value="contacted">Mark Contacted</option>
                            <option value="qualified">Mark Qualified</option>
                            <option value="closed">Mark Closed</option>
                            <option value="disqualified">Mark Disqualified</option>
                        </select>
                        <button disabled={bulkBusy} onClick={() => runBulkAction({ action: 'status', status: bulkStatus })} className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest border border-axiom-border rounded-sm text-axiom-text-mute hover:text-axiom-text-main disabled:opacity-50">Bulk Status</button>
                        <input value={bulkTagName} onChange={e => setBulkTagName(e.target.value)} placeholder="tag" className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[11px] p-2 rounded-[2px] font-mono w-28" />
                        <button disabled={bulkBusy} onClick={() => runBulkAction({ action: 'tag_add', tag_name: bulkTagName })} className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest border border-axiom-border rounded-sm text-axiom-text-mute hover:text-axiom-text-main disabled:opacity-50">Bulk Add Tag</button>
                        <button disabled={bulkBusy} onClick={() => runBulkAction({ action: 'dnc', dnc: true, dnc_reason: 'Bulk operator action' })} className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest border border-red-500/30 rounded-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50">Bulk Mark DNC</button>
                        <button onClick={exportSelectedCsv} className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest border border-accent/30 rounded-sm text-accent hover:bg-accent/10">Export Selection</button>
                    </div>
                </div>
                {bulkError ? <p className="text-red-400 font-mono text-[11px] mt-2">{bulkError}</p> : null}
                {bulkMessage ? <p className="text-emerald-400 font-mono text-[11px] mt-2">{bulkMessage}</p> : null}
            </div>

            {error ? <p className="text-red-400 font-mono text-[12px] mb-4">{error}</p> : null}
            {loading ? <p className="text-axiom-text-mute font-mono text-[12px]">Fetching intelligence...</p> : (
                <div className="axiom-bento overflow-x-auto rounded-sm border border-axiom-border">
                    <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-axiom-border bg-axiom-base/40 font-mono text-[10px] uppercase tracking-wider text-axiom-text-mute">
                            <tr>
                                <th className="p-3 font-normal w-10">
                                    <input
                                        type="checkbox"
                                        checked={sortedLeads.length > 0 && sortedLeads.every(l => selected[l.id])}
                                        onChange={toggleSelectAllVisible}
                                    />
                                </th>
                                <th className="p-4 font-normal">Business</th>
                                <th className="p-4 font-normal">Website</th>
                                <th className="p-4 font-normal">Scores</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-subtle">
                            {sortedLeads.map((lead) => {
                                const leadTags = tagsFromLead(lead);
                                return (
                                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-3 align-top">
                                            <input
                                                type="checkbox"
                                                checked={!!selected[lead.id]}
                                                onChange={() => setSelected(prev => ({ ...prev, [lead.id]: !prev[lead.id] }))}
                                            />
                                        </td>
                                        <td className="p-4 font-medium text-axiom-text-main">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span>{lead.name}</span>
                                                {Number(lead.dnc || 0) === 1 ? <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border border-red-500/30 text-red-300 rounded-sm">DNC</span> : null}
                                                {lead.duplicate_of_lead_id ? <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border border-axiom-border text-axiom-text-mute rounded-sm">Duplicate of {String(lead.duplicate_of_lead_id).slice(0, 8)}</span> : null}
                                            </div>
                                            <div className="text-[11px] text-axiom-text-mute mt-1 font-normal break-words max-w-[360px] leading-tight">
                                                {[lead.address, lead.phone].filter(Boolean).join(' â€¢ ')}
                                            </div>
                                            <div className="text-[10px] text-axiom-text-mute/70 font-mono mt-1 break-words">
                                                {lead.detected_email ? lead.detected_email : 'No email'}
                                                {lead.last_note_preview ? ` â€¢ Note: ${String(lead.last_note_preview).slice(0, 40)}` : ''}
                                            </div>
                                            {leadTags.length > 0 ? (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {leadTags.slice(0, 4).map((tag) => (
                                                        <span key={`${lead.id}-${tag}`} className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border border-axiom-border text-axiom-text-mute rounded-sm">{tag}</span>
                                                    ))}
                                                    {leadTags.length > 4 ? <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border border-axiom-border text-axiom-text-mute rounded-sm">+{leadTags.length - 4}</span> : null}
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="p-4 text-axiom-text-mute">
                                            {lead.canonical_url ? (
                                                <div className="flex items-center flex-wrap gap-y-1">
                                                    <a href={lead.canonical_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent font-mono truncate max-w-[220px] inline-block">{lead.canonical_url.replace(/^https?:\/\//, '')}</a>
                                                    {websiteSourceBadge(lead)}
                                                    {websiteVerifiedBadge(lead)}
                                                </div>
                                            ) : (
                                                <div className="flex items-center flex-wrap gap-y-1">
                                                    <span className="text-axiom-text-mute/50 italic">{websiteLabel(lead)}</span>
                                                    {websiteSourceBadge(lead)}
                                                    {websiteVerifiedBadge(lead)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {lead.score !== null ? (
                                                    <span className={`inline-flex items-center justify-center font-mono font-bold w-10 h-10 rounded-sm border ${lead.score >= 80 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : lead.score >= 50 ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                                                        {lead.score}
                                                    </span>
                                                ) : <span className="text-axiom-text-mute/40 font-mono text-[10px] uppercase">Pending</span>}
                                                <div className="text-[10px] font-mono text-axiom-text-mute">
                                                    <div>Opp {lead.opportunity_score ?? 0}</div>
                                                    <div>Qual {lead.lead_quality_score ?? 0}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col items-start gap-2">
                                                <span className={`text-[10px] font-mono px-2 py-1 rounded-sm uppercase tracking-wide border ${lead.status === 'qualified' ? 'border-accent/40 text-accent bg-accent/10' : lead.status === 'disqualified' ? 'border-red-500/30 text-red-500/80 bg-red-500/10' : 'border-axiom-border text-axiom-text-mute'}`}>
                                                    {lead.status}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleLeadDnc(lead)}
                                                    className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 border rounded-sm ${Number(lead.dnc || 0) ? 'border-red-500/30 text-red-300' : 'border-axiom-border text-axiom-text-mute hover:text-axiom-text-main'}`}
                                                >
                                                    {Number(lead.dnc || 0) ? 'Unset DNC' : 'Mark DNC'}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link to={`/leads/${lead.id}`} className="inline-block px-4 py-2 border border-axiom-border hover:border-axiom-border text-axiom-text-main text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm bg-white/5">
                                                Inspect
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Leads;



