import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiJson, errorMessage } from '../../lib/api';

const Leads: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const campaignId = searchParams.get('campaign_id');
    const statusFilter = searchParams.get('status');

    useEffect(() => {
        let url = '/api/leads';
        const params = new URLSearchParams();
        if (campaignId) params.append('campaign_id', campaignId);
        if (statusFilter) params.append('status', statusFilter);
        if (params.toString()) url += '?' + params.toString();

        setLoading(true);
        setError('');
        apiJson<{ leads?: any[] }>(url, { timeoutMs: 15000 })
            .then(data => { setLeads(data.leads || []); setLoading(false); })
            .catch(err => {
                setError(errorMessage(err, 'Failed to load leads.'));
                setLoading(false);
            });
    }, [campaignId, statusFilter]);

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-subtle pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-primary tracking-tight">Lead Intelligence Pipeline</h1>
                    <p className="text-[13px] text-secondary font-mono uppercase tracking-widest mt-2">{leads.length} Targets Found</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/campaigns" className="text-[11px] font-mono text-secondary hover:text-white uppercase tracking-widest transition-colors">← Back to Campaigns</Link>
                </div>
            </div>

            {error ? <p className="text-red-400 font-mono text-[12px] mb-4">{error}</p> : null}
            {loading ? <p className="text-secondary font-mono text-[12px]">Fetching intelligence...</p> : (
                <div className="surface-panel overflow-x-auto rounded-sm border border-subtle">
                    <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-subtle bg-black/40 font-mono text-[10px] uppercase tracking-wider text-secondary">
                            <tr>
                                <th className="p-4 font-normal">Business</th>
                                <th className="p-4 font-normal">Website</th>
                                <th className="p-4 font-normal">Score</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-subtle">
                            {leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 font-medium text-primary">
                                        {lead.name}
                                        <div className="text-[11px] text-secondary mt-1 font-normal break-words max-w-[300px] leading-tight">
                                            {[lead.address, lead.phone].filter(Boolean).join(' • ')}
                                        </div>
                                    </td>
                                    <td className="p-4 text-secondary">
                                        {lead.canonical_url ? (
                                            <a href={lead.canonical_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent font-mono truncate max-w-[200px] inline-block">{lead.canonical_url.replace(/^https?:\/\//, '')}</a>
                                        ) : <span className="text-secondary/30 italic">No web presence</span>}
                                    </td>
                                    <td className="p-4">
                                        {lead.score !== null ? (
                                            <span className={`inline-flex items-center justify-center font-mono font-bold w-10 h-10 rounded-sm border ${lead.score >= 80 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : lead.score >= 50 ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                                                {lead.score}
                                            </span>
                                        ) : <span className="text-secondary/40 font-mono text-[10px] uppercase">Pending</span>}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-mono px-2 py-1 rounded-sm uppercase tracking-wide border ${lead.status === 'qualified' ? 'border-accent/40 text-accent bg-accent/10' : lead.status === 'rejected' ? 'border-red-500/30 text-red-500/80 bg-red-500/10' : 'border-subtle text-secondary'}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link to={`/leads/${lead.id}`} className="inline-block px-4 py-2 border border-white/10 hover:border-white/30 text-primary text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm bg-white/5">
                                            Inspect
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Leads;
