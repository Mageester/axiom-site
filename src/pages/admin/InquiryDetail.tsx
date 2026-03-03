import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiJson, errorMessage } from '../../lib/api';

const InquiryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [inquiry, setInquiry] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('new');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await apiJson<{ inquiry?: any }>(`/api/inquiries/${id}`, {
                timeoutMs: 15000,
                credentials: 'include'
            });
            setInquiry(data.inquiry || null);
            setStatus(data.inquiry?.status || 'new');
        } catch (err) {
            setError(errorMessage(err, 'Failed to load inquiry.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    const saveStatus = async (nextStatus?: string) => {
        const finalStatus = nextStatus || status;
        setSaving(true);
        setSaveMsg('');
        setError('');
        try {
            await apiJson(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: finalStatus }),
                credentials: 'include',
                timeoutMs: 15000
            });
            setStatus(finalStatus);
            setSaveMsg(`Status updated to ${finalStatus}.`);
            await load();
        } catch (err) {
            setError(errorMessage(err, 'Failed to update status.'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="pt-32 pb-24 px-6 text-center text-axiom-text-mute font-mono text-[12px]">Loading inquiry...</div>;
    if (error) return <div className="pt-32 pb-24 px-6 text-center text-red-500 font-mono text-[12px]">{error}</div>;
    if (!inquiry) return <div className="pt-32 pb-24 px-6 text-center text-red-500 font-mono text-[12px]">Inquiry not found</div>;

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-axiom-border pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-axiom-text-main tracking-tight">{inquiry.business_name}</h1>
                    <p className="text-[13px] text-axiom-text-mute font-mono uppercase tracking-widest mt-2">{inquiry.primary_goal} â€¢ {new Date(inquiry.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/admin/inquiries" className="text-[11px] font-mono text-axiom-text-mute hover:text-axiom-text-main uppercase tracking-widest transition-colors">â† Back to Inquiries</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 axiom-bento p-8 rounded-sm">
                    <h2 className="text-[11px] font-mono text-axiom-text-mute uppercase tracking-widest mb-6 border-b border-axiom-border pb-3">Submission Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-[10px] font-mono text-axiom-text-mute uppercase tracking-widest mb-2">Contact Name</p>
                            <p className="text-axiom-text-main">{inquiry.name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-mono text-axiom-text-mute uppercase tracking-widest mb-2">Email</p>
                            <a href={`mailto:${inquiry.email}`} className="text-accent hover:underline font-mono break-all">{inquiry.email}</a>
                        </div>
                        <div>
                            <p className="text-[10px] font-mono text-axiom-text-mute uppercase tracking-widest mb-2">Phone</p>
                            {inquiry.phone ? <a href={`tel:${inquiry.phone}`} className="text-axiom-text-main font-mono">{inquiry.phone}</a> : <p className="text-axiom-text-mute/70">Not provided</p>}
                        </div>
                        <div>
                            <p className="text-[10px] font-mono text-axiom-text-mute uppercase tracking-widest mb-2">Current Website</p>
                            {inquiry.current_website ? <a href={inquiry.current_website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-mono break-all">{inquiry.current_website}</a> : <p className="text-axiom-text-mute/70">Not provided</p>}
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-[10px] font-mono text-axiom-text-mute uppercase tracking-widest mb-2">Primary Goal</p>
                        <p className="text-axiom-text-main font-mono">{inquiry.primary_goal}</p>
                    </div>

                    <div className="mb-6">
                        <p className="text-[10px] font-mono text-axiom-text-mute uppercase tracking-widest mb-2">Project Details</p>
                        <div className="bg-axiom-base/20 border border-axiom-border rounded-sm p-4 text-axiom-text-mute whitespace-pre-wrap leading-relaxed">
                            {inquiry.details}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] font-mono text-axiom-text-mute">
                        <div><span className="text-axiom-text-mute/70">Source Path:</span> <span className="text-axiom-text-main break-all">{inquiry.source_path || 'n/a'}</span></div>
                        <div><span className="text-axiom-text-mute/70">IP Hash:</span> <span className="text-axiom-text-main break-all">{inquiry.ip_hash || 'n/a'}</span></div>
                        <div><span className="text-axiom-text-mute/70">User Agent:</span> <span className="text-axiom-text-main break-all">{inquiry.user_agent || 'n/a'}</span></div>
                    </div>
                </div>

                <div className="lg:col-span-4 axiom-bento p-6 rounded-sm">
                    <h2 className="text-[11px] font-mono text-axiom-text-mute uppercase tracking-widest mb-6 border-b border-axiom-border pb-3">Workflow</h2>
                    {error ? <p className="text-[11px] font-mono text-red-400 mb-3">{error}</p> : null}
                    {saveMsg ? <p className="text-[11px] font-mono text-emerald-400 mb-3">{saveMsg}</p> : null}

                    <label className="text-[10px] font-mono text-axiom-text-mute/80 uppercase tracking-widest">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full mt-2 mb-4 bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[13px] p-3 rounded-[2px] outline-none font-mono"
                    >
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="booked">booked</option>
                        <option value="closed">closed</option>
                        <option value="spam">spam</option>
                    </select>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => saveStatus()}
                        className="w-full py-3 bg-white/10 border border-axiom-border hover:bg-white text-axiom-text-main hover:text-black text-[11px] font-semibold uppercase tracking-widest rounded-[2px] disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Status'}
                    </button>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => saveStatus('spam')}
                        className="w-full py-3 mt-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-300 text-[11px] font-semibold uppercase tracking-widest rounded-[2px] disabled:opacity-50"
                    >
                        Mark Spam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InquiryDetail;



