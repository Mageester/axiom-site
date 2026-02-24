import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [status, setStatus] = useState<'' | 'loading' | 'success' | 'error'>('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setMsg('');

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/public/website-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const resData = await res.json();

            if (res.ok) {
                setStatus('success');
                form.reset();
            } else {
                setStatus('error');
                setMsg(resData.error || 'Failed to submit. Please email us directly.');
            }
        } catch (err) {
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
                            Request received. We will contact you within 24 hours.
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-sm text-sm font-mono text-center mb-4">
                            {msg}
                        </div>
                    )}

                    {/* Honeypot field (hidden) */}
                    <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Your Name</label>
                            <input type="text" name="name" required className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Email Address</label>
                            <input type="email" name="email" required className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Business Name</label>
                            <input type="text" name="company" required className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Phone Number (Optional)</label>
                            <input type="tel" name="phone" className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Current Website (if any)</label>
                            <input type="url" name="website" placeholder="https://" className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Primary Goal</label>
                            <select name="goal" required className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none appearance-none">
                                <option value="">Select an option...</option>
                                <option value="New Website">I need a brand new website</option>
                                <option value="Rebuild">I need to rebuild my current website</option>
                                <option value="Landing Page">I need a landing page for ads</option>
                                <option value="Other">Other request</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mb-2">
                        <label className="text-[10px] font-mono text-secondary/80 uppercase tracking-widest pl-1">Project Details & Friction Notes</label>
                        <textarea name="notes" rows={5} required placeholder="Tell us about your business, what you need the website to do, your main frustrations with your current setup..." className="bg-[#070708] border border-white/10 text-primary text-[14px] p-4 focus-visible:border-white/40 focus-visible:bg-[#0a0a0b] transition-colors resize-none rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] outline-none"></textarea>
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
