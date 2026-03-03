import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiJson, errorMessage } from '../../lib/api';

type InquiryRow = {
    id: string;
    created_at: string;
    business_name: string;
    name: string;
    email: string;
    primary_goal: string;
    status: string;
};

const Inquiries: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [rows, setRows] = useState<InquiryRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [q, setQ] = useState(searchParams.get('q') || '');
    const [status, setStatus] = useState(searchParams.get('status') || '');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (q.trim()) params.set('q', q.trim());
            if (status) params.set('status', status);
            params.set('limit', '100');
            const data = await apiJson<{ inquiries?: InquiryRow[] }>(`/api/inquiries?${params.toString()}`, {
                timeoutMs: 15000,
                credentials: 'include'
            });
            setRows(data.inquiries || []);
        } catch (err) {
            setError(errorMessage(err, 'Failed to load inquiries.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (q.trim()) params.set('q', q.trim());
        if (status) params.set('status', status);
        setSearchParams(params);
        load();
    };

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-axiom-border pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-axiom-text-main tracking-tight">Website Inquiries</h1>
                    <p className="text-[13px] text-axiom-text-mute font-mono uppercase tracking-widest mt-2">{rows.length} Records</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/campaigns" className="text-[11px] font-mono text-axiom-text-mute hover:text-axiom-text-main uppercase tracking-widest transition-colors">Campaigns</Link>
                    <Link to="/jobs" className="text-[11px] font-mono text-axiom-text-mute hover:text-axiom-text-main uppercase tracking-widest transition-colors">Jobs</Link>
                </div>
            </div>

            <form onSubmit={applyFilters} className="axiom-bento p-4 mb-6 flex flex-col sm:flex-row gap-3 border border-axiom-border rounded-sm">
                <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search business, contact, email"
                    className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[13px] p-3 rounded-[2px] outline-none flex-1"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[13px] p-3 rounded-[2px] outline-none font-mono"
                >
                    <option value="">All statuses</option>
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="booked">booked</option>
                    <option value="closed">closed</option>
                    <option value="spam">spam</option>
                </select>
                <button type="submit" className="px-4 py-3 bg-white/10 border border-axiom-border hover:bg-white text-axiom-text-main hover:text-black text-[11px] font-semibold uppercase tracking-widest rounded-[2px]">
                    Filter
                </button>
            </form>

            {error ? <p className="text-red-400 font-mono text-[12px] mb-4">{error}</p> : null}
            {loading ? <p className="text-axiom-text-mute font-mono text-[12px]">Loading inquiries...</p> : (
                <div className="axiom-bento overflow-x-auto rounded-sm border border-axiom-border">
                    <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-axiom-border bg-axiom-base/40 font-mono text-[10px] uppercase tracking-wider text-axiom-text-mute">
                            <tr>
                                <th className="p-4 font-normal">Created</th>
                                <th className="p-4 font-normal">Business</th>
                                <th className="p-4 font-normal">Contact</th>
                                <th className="p-4 font-normal">Goal</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-subtle">
                            {rows.map((row) => (
                                <tr key={row.id} className="hover:bg-white/[0.02]">
                                    <td className="p-4 text-axiom-text-mute font-mono text-[11px]">{new Date(row.created_at).toLocaleString()}</td>
                                    <td className="p-4 text-axiom-text-main">{row.business_name}</td>
                                    <td className="p-4 text-axiom-text-mute">
                                        <div>{row.name}</div>
                                        <div className="text-[11px] font-mono text-axiom-text-mute/70">{row.email}</div>
                                    </td>
                                    <td className="p-4 text-axiom-text-mute font-mono text-[11px]">{row.primary_goal}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-mono px-2 py-1 rounded-sm uppercase tracking-wide border ${row.status === 'new' ? 'border-accent/30 text-accent bg-accent/10' : row.status === 'spam' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-axiom-border text-axiom-text-mute'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link to={`/admin/inquiries/${row.id}`} className="inline-block px-4 py-2 border border-axiom-border hover:border-axiom-border text-axiom-text-main text-[10px] font-semibold tracking-widest uppercase rounded-sm bg-white/5">
                                            Open
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {rows.length === 0 ? (
                                <tr>
                                    <td className="p-6 text-axiom-text-mute font-mono text-[12px]" colSpan={6}>No inquiries found.</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Inquiries;



