import React, { useState, useEffect } from 'react';

const Jobs: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);

    const loadData = () => {
        fetch('/api/jobs')
            .then(res => res.json())
            .then(data => {
                setJobs(data.jobs || []);
                setStats(data.stats || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleRun = async () => {
        setRunning(true);
        try {
            await fetch('/api/jobs/run', { method: 'POST' });
            loadData();
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto w-full">
            <div className="flex justify-between items-end mb-10 border-b border-subtle pb-6">
                <div>
                    <h1 className="text-3xl font-semibold text-primary tracking-tight">System Job Queue</h1>
                    <p className="text-[13px] text-secondary font-mono uppercase tracking-widest mt-2">{jobs.length} Recent Tasks</p>
                </div>
                <button
                    disabled={running}
                    onClick={handleRun}
                    className="px-6 py-3 bg-white hover:bg-[#e2e2e2] active:scale-[0.99] text-black text-[11px] font-bold uppercase tracking-[0.05em] transition-all rounded-[2px] shadow-lg disabled:opacity-50"
                >
                    {running ? 'Execution Commencing...' : 'Force Queue Execution'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                {stats.length > 0 ? stats.map((s, i) => (
                    <div key={i} className="surface-panel p-5 bg-black/40 border border-white/5 flex flex-col items-center">
                        <span className={`text-[20px] font-bold font-mono tracking-tight ${s.status === 'done' ? 'text-emerald-400' : s.status === 'failed' ? 'text-red-400' : 'text-accent'}`}>{s.c}</span>
                        <span className="text-[10px] text-secondary/60 font-mono tracking-widest uppercase mt-1">{s.status}</span>
                    </div>
                )) : (
                    <div className="text-secondary font-mono text-[11px] lg:col-span-4 text-center">No active telemetry stats</div>
                )}
            </div>

            <div className="surface-panel overflow-hidden border border-subtle rounded-sm">
                {loading && jobs.length === 0 ? <p className="p-6 text-secondary font-mono text-[12px]">Connecting to queue module...</p> : (
                    <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-subtle bg-black/40 font-mono text-[10px] uppercase tracking-wider text-secondary">
                            <tr>
                                <th className="p-4 font-normal">Task Type</th>
                                <th className="p-4 font-normal">Timestamp</th>
                                <th className="p-4 font-normal">Attempts</th>
                                <th className="p-4 font-normal">Diagnostics</th>
                                <th className="p-4 font-normal text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {jobs.map(job => (
                                <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 font-medium text-primary font-mono text-[11px]">{job.type}</td>
                                    <td className="p-4 text-secondary/60 text-[11px] font-mono">{new Date(job.created_at).toLocaleString()}</td>
                                    <td className="p-4 text-secondary/80 font-mono">{job.attempts}</td>
                                    <td className="p-4">
                                        {job.last_error ? <span className="text-[10px] font-mono text-red-500/80 break-words">{job.last_error.substring(0, 50)}...</span> : <span className="text-secondary/40 font-mono text-[10px] italic">OK</span>}
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`text-[10px] font-mono px-2 py-1 rounded-sm uppercase tracking-wide border ${job.status === 'done' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : job.status === 'failed' ? 'border-red-500/30 text-red-500/80 bg-red-500/10' : 'border-accent/30 text-accent bg-accent/10'}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Jobs;
