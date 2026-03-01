import React, { useState } from 'react';
import { SEO } from '../components/SEO';

type SubmitState = '' | 'loading' | 'success' | 'error';

const AuditPage: React.FC = () => {
    const [status, setStatus] = useState<SubmitState>('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const website = formData.get('website') as string;

        if (!name || !email || !website) {
            setStatus('error');
            setMsg('Please fill out all fields.');
            return;
        }

        setStatus('loading');
        setMsg('');

        try {
            const res = await fetch('/api/intake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    current_website: website,
                    primary_goal: 'audit_request',
                    details: 'Automated request for a complimentary engineering audit.',
                    source_path: window.location.pathname
                })
            });

            if (res.ok) {
                setStatus('success');
                setMsg('Blueprint Request Received. Our engineering team will review your infrastructure and respond within 24 hours.');
                return;
            }

            setStatus('error');
            setMsg('Failed to submit. Please try again or email us directly.');
        } catch {
            setStatus('error');
            setMsg('Network error. Please try again or email us.');
        }
    };

    return (
        <div className="pt-32 pb-24 min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
            <SEO
                title="Complimentary Engineering Audit | Axiom Infrastructure"
                description="Get a complimentary engineering audit of your website's performance, UX, and infrastructure."
            />
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 60%)' }}></div>

            <div className="max-w-[600px] mx-auto w-full relative z-10 px-6 reveal">
                <div className="text-center mb-12">
                    <h1 className="text-[40px] md:text-[56px] font-semibold mb-6 text-primary tracking-tight leading-[1.05]">Is your website<br />a liability?</h1>
                    <p className="text-[16px] text-secondary max-w-lg mx-auto leading-relaxed">
                        Most local business sites leak revenue due to outdated infrastructure. Get a complimentary engineering audit.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#0f1113] border border-white/5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)] p-8 md:p-10 flex flex-col gap-6 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

                    {status === 'success' && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-[2px] text-[14px] font-medium text-center mb-2">
                            {msg}
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-[2px] text-[14px] font-medium text-center mb-2">
                            {msg}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Name</label>
                        <input type="text" name="name" required minLength={2} className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Email</label>
                        <input type="email" name="email" required className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Website URL</label>
                        <input type="url" name="website" required placeholder="https://" className="bg-[#070708] border border-white/10 text-primary text-[16px] p-4 min-h-[48px] focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                    </div>

                    <button disabled={status === 'loading' || status === 'success'} type="submit" className="w-full py-4 mt-4 bg-white text-black hover:bg-[#e2e2e2] hover:scale-[1.01] active:scale-[0.99] min-h-[50px] text-[14px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px] disabled:opacity-50">
                        {status === 'loading' ? 'Analyzing...' : 'Analyze My Infrastructure'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuditPage;
