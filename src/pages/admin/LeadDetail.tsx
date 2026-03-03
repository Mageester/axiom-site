import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiJson, errorMessage } from '../../lib/api';

function parseTagsCsv(value: unknown): string[] {
    return String(value || '').split('|').map(v => v.trim()).filter(Boolean);
}

const LeadDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');
    const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
    const [tagInput, setTagInput] = useState('');
    const [notesHistory, setNotesHistory] = useState<Array<{ id: string; note_text: string; created_at?: string }>>([]);
    const [newNote, setNewNote] = useState('');
    const [addingNote, setAddingNote] = useState(false);

    const [status, setStatus] = useState('new');
    const [notes, setNotes] = useState('');
    const [dnc, setDnc] = useState(false);
    const [dncReason, setDncReason] = useState('');

    const loadLead = async () => {
        setLoading(true);
        setLoadError('');
        try {
            const [leadData, tagData, noteData] = await Promise.all([
                apiJson<{ lead: any }>(`/api/leads/${id}`, { timeoutMs: 15000, credentials: 'include' }),
                apiJson<{ tags?: any[] }>(`/api/leads/${id}/tags`, { timeoutMs: 10000, credentials: 'include' }).catch(() => ({ tags: [] })),
                apiJson<{ notes?: any[] }>(`/api/leads/${id}/notes`, { timeoutMs: 10000, credentials: 'include' }).catch(() => ({ notes: [] }))
            ]);
            setLead(leadData.lead);
            setStatus(leadData.lead?.status || 'new');
            setNotes(leadData.lead?.notes || '');
            setDnc(Number(leadData.lead?.dnc || 0) === 1);
            setDncReason(leadData.lead?.dnc_reason || '');
            setTags((tagData.tags || []).map((t: any) => ({ id: String(t.id), name: String(t.name) })));
            setNotesHistory(noteData.notes || []);
        } catch (err) {
            setLoadError(errorMessage(err, 'Failed to load lead.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLead();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        setSaveError('');
        setSaveSuccess('');
        try {
            await apiJson(`/api/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, notes, dnc, dnc_reason: dnc ? dncReason : null }),
                credentials: 'include',
                timeoutMs: 15000
            });
            setSaveSuccess('Saved.');
            await loadLead();
        } catch (err) {
            setSaveError(errorMessage(err, 'Failed to save lead.'));
        } finally {
            setSaving(false);
        }
    };

    const addTag = async () => {
        const value = tagInput.trim();
        if (!value) return;
        try {
            await apiJson(`/api/leads/${id}/tags`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag_name: value }),
                credentials: 'include',
                timeoutMs: 10000
            });
            setTagInput('');
            const tagData = await apiJson<{ tags?: any[] }>(`/api/leads/${id}/tags`, { credentials: 'include', timeoutMs: 10000 });
            setTags((tagData.tags || []).map((t: any) => ({ id: String(t.id), name: String(t.name) })));
        } catch (err) {
            setSaveError(errorMessage(err, 'Failed to add tag.'));
        }
    };

    const removeTag = async (tag: { id: string; name: string }) => {
        try {
            await apiJson(`/api/leads/${id}/tags?tag_id=${encodeURIComponent(tag.id)}`, {
                method: 'DELETE',
                credentials: 'include',
                timeoutMs: 10000
            });
            setTags(prev => prev.filter(t => t.id !== tag.id));
        } catch (err) {
            setSaveError(errorMessage(err, 'Failed to remove tag.'));
        }
    };

    const addNote = async () => {
        const value = newNote.trim();
        if (!value) return;
        setAddingNote(true);
        try {
            await apiJson(`/api/leads/${id}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note_text: value }),
                credentials: 'include',
                timeoutMs: 10000
            });
            setNewNote('');
            const noteData = await apiJson<{ notes?: any[] }>(`/api/leads/${id}/notes`, { credentials: 'include', timeoutMs: 10000 });
            setNotesHistory(noteData.notes || []);
        } catch (err) {
            setSaveError(errorMessage(err, 'Failed to add note.'));
        } finally {
            setAddingNote(false);
        }
    };

    const websiteSourceLabel = lead?.website_source === 'nominatim' ? 'Nominatim' : lead?.website_source === 'inferred_email' ? 'Email' : lead?.website_source === 'overpass' ? 'OSM' : '';
    const websiteVerifiedLabel = lead?.website_verified === 'confirmed_live' ? 'Live' : lead?.website_verified === 'unreachable' ? 'Unreachable' : lead?.website_verified === 'invalid_format' ? 'Invalid' : 'Unknown';

    const outreachAngles = useMemo(() => {
        if (!lead) return [];
        const out: string[] = [];
        if (!lead.canonical_url) out.push('No website found: position a fast launch site + quote form as immediate conversion lift.');
        if (String(lead.website_verified || '') === 'unreachable') out.push('Website unreachable: position monitoring/repair + conversion recovery.');
        if (Number(lead.has_form ?? lead.intake_present ?? 0) === 0) out.push('Missing intake form: position quote intake to capture high-intent traffic.');
        if (Number(lead.has_booking ?? lead.booking_present ?? 0) === 0) out.push('Missing booking workflow: position self-serve scheduling to reduce admin overhead.');
        if (!out.length) out.push('Website and contact signals present: position speed/SEO/CRO optimization.');
        return out.slice(0, 3);
    }, [lead]);

    const emailTemplate = useMemo(() => {
        if (!lead) return '';
        return `Subject: Quick win for ${lead.name}\n\nHi ${lead.name} team,\n\nI noticed ${!lead.canonical_url ? 'you may not have a website listed' : 'a few conversion gaps on your site'}${Number(lead.has_form ?? lead.intake_present ?? 0) === 0 ? ', including no visible quote/intake flow' : ''}${Number(lead.has_booking ?? lead.booking_present ?? 0) === 0 ? ' and no booking flow' : ''}.\n\nWe help local service businesses fix exactly this with fast, measurable improvements.\n\nWould a quick 10-minute review be useful this week?\n\n- {{your_name}}`;
    }, [lead]);

    const smsTemplate = useMemo(() => {
        if (!lead) return '';
        return `Hi ${lead.name}, quick note: we help service businesses improve leads from their web presence${!lead.canonical_url ? ' (including getting a site live)' : ''}. Want a short no-pressure audit summary? - {{your_name}}`;
    }, [lead]);

    if (loading) return <div className="pt-32 pb-24 px-6 text-center text-axiom-text-mute font-mono text-[12px]">Decrypting intelligence...</div>;
    if (loadError) return <div className="pt-32 pb-24 px-6 text-center text-red-500 font-mono text-[12px]">{loadError}</div>;
    if (!lead) return <div className="pt-32 pb-24 px-6 text-center text-red-500 font-mono text-[12px]">Lead not found</div>;

    let bullets: string[] = [];
    try {
        bullets = lead.bullets_json ? JSON.parse(lead.bullets_json) : [];
    } catch {
        bullets = [];
    }

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-axiom-border pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-axiom-text-main tracking-tight">{lead.name}</h1>
                    <p className="text-[13px] text-axiom-text-mute font-mono tracking-widest mt-2">{lead.address}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/leads" className="text-[11px] font-mono text-axiom-text-mute hover:text-axiom-text-main uppercase tracking-widest transition-colors">â† Back to Pipeline</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="axiom-bento p-8 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                        <h2 className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-6 border-b border-axiom-border pb-3">Audit Intelligence</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                            <div><div className="text-[10px] uppercase font-mono text-axiom-text-mute">Aesthetic</div><div className="text-[24px] font-bold font-mono">{lead.score ?? 'N/A'}</div></div>
                            <div><div className="text-[10px] uppercase font-mono text-axiom-text-mute">Opportunity</div><div className="text-[24px] font-bold font-mono">{lead.opportunity_score ?? 0}</div></div>
                            <div><div className="text-[10px] uppercase font-mono text-axiom-text-mute">Lead Quality</div><div className="text-[24px] font-bold font-mono">{lead.lead_quality_score ?? 0}</div></div>
                            <div><div className="text-[10px] uppercase font-mono text-axiom-text-mute">Speed (ms)</div><div className="text-[24px] font-semibold font-mono">{lead.response_time_ms ?? '--'}</div></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-[12px]">
                            <div className="border border-axiom-border rounded-sm p-4">
                                <div className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute mb-2">Website Intelligence</div>
                                {lead.canonical_url ? <a href={lead.canonical_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-mono break-all">{lead.canonical_url}</a> : <p className="text-axiom-text-mute/70 italic">{lead.website_status === 'confirmed_missing' ? 'None' : 'Unknown'}</p>}
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {websiteSourceLabel ? <span className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest border border-axiom-border rounded-sm text-axiom-text-mute">{websiteSourceLabel}</span> : null}
                                    <span className={`px-2 py-1 text-[9px] font-mono uppercase tracking-widest border rounded-sm ${lead.website_verified === 'confirmed_live' ? 'border-emerald-500/30 text-emerald-400' : lead.website_verified === 'unreachable' ? 'border-red-500/30 text-red-400' : 'border-axiom-border text-axiom-text-mute'}`}>{websiteVerifiedLabel}</span>
                                </div>
                                {lead.website_last_checked_at ? <p className="text-[10px] font-mono text-axiom-text-mute/70 mt-2">Checked: {new Date(lead.website_last_checked_at).toLocaleString()}</p> : null}
                            </div>
                            <div className="border border-axiom-border rounded-sm p-4">
                                <div className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute mb-2">Contactability</div>
                                {lead.phone ? <a href={`tel:${lead.phone}`} className="block text-axiom-text-main font-mono">{lead.phone}</a> : <p className="text-axiom-text-mute/70">No phone</p>}
                                {lead.detected_email ? <a href={`mailto:${lead.detected_email}`} className="block text-axiom-text-main font-mono break-all mt-1">{lead.detected_email}</a> : <p className="text-axiom-text-mute/70 mt-1">No email</p>}
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 text-[9px] font-mono uppercase tracking-widest border rounded-sm ${Number(lead.dnc || 0) ? 'border-red-500/30 text-red-300' : 'border-emerald-500/30 text-emerald-300'}`}>{Number(lead.dnc || 0) ? 'DNC' : 'Contactable'}</span>
                                    <span className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest border border-axiom-border rounded-sm text-axiom-text-mute">{(lead.phone || lead.detected_email) && !Number(lead.dnc || 0) ? 'Ready to Contact' : 'Needs Data'}</span>
                                </div>
                            </div>
                        </div>

                        {bullets.length > 0 && (
                            <div className="bg-axiom-base/20 p-5 border border-axiom-border rounded-sm mb-5">
                                <h3 className="text-[10px] font-mono text-axiom-text-main/50 uppercase tracking-widest mb-4">Outreach Ammunition</h3>
                                <ul className="flex flex-col gap-3">
                                    {bullets.map((b: string, i: number) => (
                                        <li key={i} className="text-[14px] text-axiom-text-mute flex items-start gap-3"><span className="text-axiom-text-mute/30 font-mono mt-0.5 text-[10px] shrink-0">â†’</span>{b}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="bg-axiom-base/20 p-5 border border-axiom-border rounded-sm">
                            <h3 className="text-[10px] font-mono text-axiom-text-main/50 uppercase tracking-widest mb-4">Outreach Assistant</h3>
                            <div className="space-y-3">
                                {outreachAngles.map((angle, i) => (
                                    <p key={i} className="text-[13px] text-axiom-text-mute"><span className="text-accent font-mono mr-2">{i + 1}.</span>{angle}</p>
                                ))}
                                <div className="grid grid-cols-1 gap-3 mt-3">
                                    <div>
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute mb-2">Email Template</p>
                                        <textarea readOnly rows={7} value={emailTemplate} className="w-full bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[12px] p-3 rounded-[2px] font-mono" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute mb-2">SMS Template</p>
                                        <textarea readOnly rows={3} value={smsTemplate} className="w-full bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[12px] p-3 rounded-[2px] font-mono" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="axiom-bento p-6 rounded-sm relative">
                        <h2 className="text-[11px] font-mono text-axiom-text-mute uppercase tracking-widest mb-6 border-b border-axiom-border pb-3">Contact & Operations</h2>
                        <div className="flex flex-col gap-4">
                            {saveError ? <p className="text-[11px] font-mono text-red-400">{saveError}</p> : null}
                            {saveSuccess ? <p className="text-[11px] font-mono text-emerald-400">{saveSuccess}</p> : null}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-axiom-text-mute/80 uppercase tracking-widest">Pipeline Status</label>
                                <select value={status} onChange={e => setStatus(e.target.value)} className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[13px] p-3 rounded-[2px] outline-none font-mono">
                                    <option value="new">Uncontacted (New)</option>
                                    <option value="contacted">Outreach Sent</option>
                                    <option value="qualified">Qualified Meeting</option>
                                    <option value="closed">Closed / Won</option>
                                    <option value="disqualified">Disqualified</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-axiom-text-mute/80 uppercase tracking-widest">Do Not Contact</label>
                                <label className="flex items-center gap-2 text-[12px] text-axiom-text-main">
                                    <input type="checkbox" checked={dnc} onChange={e => setDnc(e.target.checked)} />
                                    Mark lead as DNC
                                </label>
                                <input
                                    type="text"
                                    value={dncReason}
                                    onChange={e => setDncReason(e.target.value)}
                                    placeholder="Reason (optional)"
                                    className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[12px] p-3 rounded-[2px] outline-none font-sans"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-axiom-text-mute/80 uppercase tracking-widest">Operator Notes (Current)</label>
                                <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[13px] p-3 focus-visible:border-axiom-border rounded-[2px] outline-none resize-none font-sans" />
                            </div>

                            <button disabled={saving} onClick={handleSave} className="w-full py-3 mt-1 bg-white/10 border border-axiom-border hover:bg-white text-axiom-text-main hover:text-black font-semibold text-[11px] uppercase tracking-widest transition-all rounded-[2px] disabled:opacity-50">
                                {saving ? 'Writing memory...' : 'Save Operations Data'}
                            </button>
                        </div>
                    </div>

                    <div className="axiom-bento p-6 rounded-sm">
                        <h2 className="text-[11px] font-mono text-axiom-text-mute uppercase tracking-widest mb-4 border-b border-axiom-border pb-3">Tags</h2>
                        <div className="flex gap-2 mb-3">
                            <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add tag" className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[12px] p-2 rounded-[2px] outline-none font-mono flex-1" />
                            <button type="button" onClick={addTag} className="px-3 py-2 border border-axiom-border text-axiom-text-mute hover:text-axiom-text-main text-[10px] font-mono uppercase tracking-widest rounded-sm">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button key={tag.id} type="button" onClick={() => removeTag(tag)} className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest border border-axiom-border text-axiom-text-mute hover:text-red-300 hover:border-red-500/30 rounded-sm">
                                    {tag.name} Ã—
                                </button>
                            ))}
                            {tags.length === 0 ? parseTagsCsv(lead.tags_csv).map((name) => (
                                <span key={`read-${name}`} className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest border border-axiom-border text-axiom-text-mute rounded-sm">{name}</span>
                            )) : null}
                            {tags.length === 0 && !lead.tags_csv ? <p className="text-[11px] text-axiom-text-mute/70">No tags yet.</p> : null}
                        </div>
                    </div>

                    <div className="axiom-bento p-6 rounded-sm">
                        <h2 className="text-[11px] font-mono text-axiom-text-mute uppercase tracking-widest mb-4 border-b border-axiom-border pb-3">Notes History</h2>
                        <div className="flex gap-2 mb-3">
                            <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={2} placeholder="Add timestamped note entry..." className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[12px] p-2 rounded-[2px] outline-none font-sans flex-1 resize-none" />
                            <button disabled={addingNote} type="button" onClick={addNote} className="px-3 py-2 border border-axiom-border text-axiom-text-mute hover:text-axiom-text-main text-[10px] font-mono uppercase tracking-widest rounded-sm disabled:opacity-50">{addingNote ? 'Addingâ€¦' : 'Add'}</button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-auto">
                            {notesHistory.map((n) => (
                                <div key={n.id} className="border border-axiom-border rounded-sm p-3">
                                    <p className="text-[10px] font-mono text-axiom-text-mute/70 mb-1">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</p>
                                    <p className="text-[12px] text-axiom-text-mute whitespace-pre-wrap">{n.note_text}</p>
                                </div>
                            ))}
                            {notesHistory.length === 0 ? <p className="text-[11px] text-axiom-text-mute/70">No note history yet.</p> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;



