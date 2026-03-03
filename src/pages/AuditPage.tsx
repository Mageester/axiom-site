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
            const payload = {
                name,
                email,
                current_website: website,
                primary_goal: 'audit_request',
                details: 'Automated request for a complimentary engineering audit.',
                source_path: window.location.pathname
            };
            console.log('[AXIOM] Sending Payload:', payload);

            const res = await fetch('/api/intake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStatus('success');
                setMsg('Axiom Blueprint Requested.');
                return;
            }

            setStatus('error');
            setMsg('Engineering Link Failed. Please reach out to aidan@getaxiom.ca directly while we recalibrate.');
        } catch {
            setStatus('error');
            setMsg('Engineering Link Failed. Please reach out to aidan@getaxiom.ca directly while we recalibrate.');
        }
    };

    return (
        <div className="pt-32 pb-24 min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden px-6 md:px-10 xl:px-20">
            <SEO
                title="Complimentary Engineering Audit | Axiom Infrastructure"
                description="Get a complimentary engineering audit of your website's performance, UX, and infrastructure."
            />
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 60%)' }}></div>

            <div className="max-w-[600px] mx-auto w-full relative z-10 px-6 reveal">
                <div className="text-center mb-12">
                    <h1 className="text-[40px] md:text-[56px] font-semibold mb-6 text-axiom-text-main tracking-tight leading-[1.05]">Is your website<br />a liability?</h1>
                    <p className="text-[16px] text-axiom-text-mute max-w-lg mx-auto leading-relaxed">
                        Most local business sites leak revenue due to outdated infrastructure. Get a complimentary engineering audit.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="axiom-glass p-8 md:p-10 flex flex-col gap-6 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

                    {status === 'success' && (
                        <div className="absolute inset-0 bg-[#0f1113] z-50 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="text-accent mb-6 w-12 h-12 flex items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-[24px] font-semibold text-axiom-text-main mb-3">Axiom Blueprint Requested.</h2>
                            <p className="text-[14px] text-axiom-text-mute leading-relaxed max-w-sm">
                                Our engineering team will review your infrastructure and respond within 24 hours.
                            </p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="bg-axiom-elevated border border-[#2a2218] text-[#a89070] p-5 rounded-[2px] text-[13px] font-mono leading-relaxed mb-2 flex items-start gap-4 animate-in fade-in duration-300">
                            <div className="w-2 h-2 mt-1.5 bg-[#6b4c2a] rounded-sm shrink-0"></div>
                            <p>{msg}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-mono text-axiom-text-mute/80 uppercase tracking-widest pl-1">Name</label>
                        <input type="text" name="name" required minLength={2} className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[16px] p-4 min-h-[48px] focus-visible:border-axiom-border focus-visible:bg-axiom-surface transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-mono text-axiom-text-mute/80 uppercase tracking-widest pl-1">Email</label>
                        <input type="email" name="email" required className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[16px] p-4 min-h-[48px] focus-visible:border-axiom-border focus-visible:bg-axiom-surface transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-mono text-axiom-text-mute/80 uppercase tracking-widest pl-1">Website URL</label>
                        <input type="url" name="website" required placeholder="https://" className="bg-axiom-elevated border border-axiom-border text-axiom-text-main text-[16px] p-4 min-h-[48px] focus-visible:border-axiom-border focus-visible:bg-axiom-surface transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                    </div>

                    <button disabled={status === 'loading' || status === 'success'} type="submit" className="btn-primary w-full py-4 mt-4 min-h-[50px] text-[14px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px] disabled:opacity-50">
                        {status === 'loading' ? 'Analyzing...' : 'Analyze My Infrastructure'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuditPage;


