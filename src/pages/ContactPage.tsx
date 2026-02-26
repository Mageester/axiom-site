import React, { useState } from 'react';

type SubmitState = '' | 'loading' | 'success' | 'error';

type IntakeFormState = {
    name: string;
    email: string;
    business_name: string;
    phone: string;
    current_website: string;
    primary_goal: string;
    details: string;
    company_fax: string;
};

const INITIAL_FORM: IntakeFormState = {
    name: '',
    email: '',
    business_name: '',
    phone: '',
    current_website: '',
    primary_goal: '',
    details: '',
    company_fax: ''
};

const ContactPage: React.FC = () => {
    const [form, setForm] = useState<IntakeFormState>(INITIAL_FORM);
    const [status, setStatus] = useState<SubmitState>('');
    const [msg, setMsg] = useState('');

    const setField = (key: keyof IntakeFormState, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setMsg('');

        try {
            const res = await fetch('/api/intake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    source_path: window.location.pathname
                })
            });

            let resData: any = {};
            try {
                resData = await res.json();
            } catch {
                resData = {};
            }

            if (res.ok) {
                setStatus('success');
                setMsg('Request received — we’ll email you within 24–48 hours.');
                setForm(INITIAL_FORM);
                return;
            }

            if (res.status === 400) {
                setStatus('error');
                setMsg(resData?.details || resData?.error || 'Please review your form fields and try again.');
                return;
            }
            if (res.status === 429) {
                setStatus('error');
                setMsg(resData?.error || 'Too many requests. Please wait and try again.');
                return;
            }

            setStatus('error');
            setMsg(resData?.error || 'Failed to submit. Please email us directly.');
        } catch {
            setStatus('error');
            setMsg('Network error. Please try again or email us.');
        }
    };

    return (
        <div className="pt-32 pb-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 60%)' }}></div>

            <div className="max-w-[700px] mx-auto w-full relative z-10 px-6 reveal">
                <div className="text-center mb-16">
                    <h1 className="text-[40px] font-semibold mb-4 text-primary tracking-tight">Let's Build Your Website</h1>
                    <p className="text-[15px] text-secondary max-w-md mx-auto leading-relaxed">Fill out the form below. We'll review your details and reach out to discuss your project.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#0f1113] border border-white/5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)] p-8 md:p-12 flex flex-col gap-8 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

                    {status === 'success' && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-sm text-sm font-mono text-center mb-4">
                            {msg || 'Request received — we’ll email you within 24–48 hours.'}
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-sm text-sm font-mono text-center mb-4">
                            {msg}
                        </div>
                    )}

                    <div className="absolute left-[-10000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                        <label htmlFor="company-fax">Company Fax</label>
                        <input
                            id="company-fax"
                            type="text"
                            name="company_fax"
                            tabIndex={-1}
                            autoComplete="off"
                            value={form.company_fax}
                            onChange={(e) => setField('company_fax', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Your Name</label>
                            <input type="text" name="name" required minLength={2} maxLength={80} value={form.name} onChange={(e) => setField('name', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Email Address</label>
                            <input type="email" name="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Business Name</label>
                            <input type="text" name="business_name" required minLength={2} maxLength={120} value={form.business_name} onChange={(e) => setField('business_name', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Phone Number (Optional)</label>
                            <input type="tel" name="phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Current Website (if any)</label>
                            <input type="url" name="current_website" placeholder="https://example.com" value={form.current_website} onChange={(e) => setField('current_website', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Primary Goal</label>
                            <select name="primary_goal" required value={form.primary_goal} onChange={(e) => setField('primary_goal', e.target.value)} className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none appearance-none">
                                <option value="">Select an option...</option>
                                <option value="new_site">I need a brand new website</option>
                                <option value="rebuild">I need to rebuild my current website</option>
                                <option value="landing_page">I need a landing page for ads</option>
                                <option value="maintenance">I need ongoing site maintenance</option>
                                <option value="seo_performance">I need better speed / SEO performance</option>
                                <option value="not_sure">Not sure yet (need guidance)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mb-2">
                        <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Project Details & Friction Notes</label>
                        <textarea name="details" rows={5} required minLength={20} maxLength={2000} value={form.details} onChange={(e) => setField('details', e.target.value)} placeholder="Tell us about your business, what you need the website to do, and your biggest pain points..." className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors resize-none rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none"></textarea>
                    </div>

                    <button disabled={status === 'loading'} type="submit" className="w-full py-4 mt-2 bg-white text-black hover:bg-[#e2e2e2] hover:scale-[1.01] active:scale-[0.99] text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-[2px] disabled:opacity-50">
                        {status === 'loading' ? 'Sending Request...' : 'Submit Request'}
                    </button>

                    <p className="text-center text-[10px] text-secondary/40 font-mono mt-4">
                        Or email us directly at: <a href="mailto:contact@axiominfrastructure.com" className="hover:text-primary transition-colors">contact@axiominfrastructure.com</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
