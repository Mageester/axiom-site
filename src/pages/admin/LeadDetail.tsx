import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const LeadDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [status, setStatus] = useState('new');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetch(`/api/leads/${id}`)
            .then(res => res.json())
            .then(data => {
                setLead(data.lead);
                setStatus(data.lead?.status || 'new');
                setNotes(data.lead?.notes || '');
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`/api/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, notes })
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="pt-32 pb-24 px-6 text-center text-secondary font-mono text-[12px]">Decrypting intelligence...</div>;
    if (!lead) return <div className="pt-32 pb-24 px-6 text-center text-red-500 font-mono text-[12px]">Lead not found</div>;

    const bullets = lead.bullets_json ? JSON.parse(lead.bullets_json) : [];

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-subtle pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-primary tracking-tight">{lead.name}</h1>
                    <p className="text-[13px] text-secondary font-mono tracking-widest mt-2">{lead.address}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/leads" className="text-[11px] font-mono text-secondary hover:text-white uppercase tracking-widest transition-colors">← Back to Pipeline</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Intel panel */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="surface-panel p-8 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                        <h2 className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-6 border-b border-subtle pb-3">Audit Intelligence</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-mono text-secondary">Aesthetic Score</span>
                                <span className={`text-[24px] font-bold font-mono tracking-tight ${lead.score >= 80 ? 'text-emerald-400' : lead.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{lead.score ?? 'N/A'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-mono text-secondary">Speed (ms)</span>
                                <span className="text-[24px] font-semibold text-primary font-mono tracking-tight">{lead.response_time_ms ?? '--'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-mono text-secondary">Intake Form</span>
                                <span className="text-[20px] font-semibold text-primary tracking-tight">{lead.has_form ? 'Detected' : 'Missing'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-mono text-secondary">Booking Integ.</span>
                                <span className="text-[20px] font-semibold text-primary tracking-tight">{lead.has_booking ? 'Detected' : 'Missing'}</span>
                            </div>
                        </div>

                        {bullets.length > 0 && (
                            <div className="bg-black/20 p-5 border border-white/5 rounded-sm">
                                <h3 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4">Outreach Ammunition</h3>
                                <ul className="flex flex-col gap-3">
                                    {bullets.map((b: string, i: number) => (
                                        <li key={i} className="text-[14px] text-secondary flex items-start gap-3">
                                            <span className="text-secondary/30 font-mono mt-0.5 text-[10px] shrink-0">→</span>
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Operations Panel */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="surface-panel p-6 rounded-sm relative">
                        <h2 className="text-[11px] font-mono text-secondary uppercase tracking-widest mb-6 border-b border-subtle pb-3">Contact & Operations</h2>

                        <div className="flex flex-col gap-4 mb-6">
                            <a href={lead.canonical_url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-accent hover:underline font-mono truncate">{lead.canonical_url}</a>
                            {lead.phone && <a href={`tel:${lead.phone}`} className="text-[13px] text-primary font-mono">{lead.phone}</a>}
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest">Pipeline Status</label>
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    className="bg-[#070708] border border-white/10 text-primary text-[13px] p-3 rounded-[2px] outline-none font-mono"
                                >
                                    <option value="new">Uncontacted (New)</option>
                                    <option value="contacted">Outreach Sent</option>
                                    <option value="qualified">Qualified Meeting</option>
                                    <option value="closed">Closed / Won</option>
                                    <option value="disqualified">Disqualified</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest">Operator Notes</label>
                                <textarea
                                    rows={4}
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="bg-[#070708] border border-white/10 text-primary text-[13px] p-3 focus-visible:border-white/40 rounded-[2px] outline-none resize-none font-sans"
                                ></textarea>
                            </div>

                            <button disabled={saving} onClick={handleSave} className="w-full py-3 mt-2 bg-white/10 border border-white/20 hover:bg-white text-primary hover:text-black font-semibold text-[11px] uppercase tracking-widest transition-all rounded-[2px] disabled:opacity-50">
                                {saving ? 'Writing memory...' : 'Save Operations Data'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;
