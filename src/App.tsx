import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { BrandLockup } from './components/BrandLockup';

import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ConceptsPage from './pages/Concepts';
import WorkCaseStudyPage from './pages/WorkCaseStudyPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import AuditPage from './pages/AuditPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import Manifesto from './pages/Manifesto';

const Login = lazy(() => import('./pages/admin/Login'));
const Account = lazy(() => import('./pages/admin/Account'));
const Campaigns = lazy(() => import('./pages/admin/Campaigns'));
const Leads = lazy(() => import('./pages/admin/Leads'));
const LeadDetail = lazy(() => import('./pages/admin/LeadDetail'));
const Jobs = lazy(() => import('./pages/admin/Jobs'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));
const InquiryDetail = lazy(() => import('./pages/admin/InquiryDetail'));

import ProtectedRoute from './components/ProtectedRoute';

const globalTrustSignals = [
    'Sub-Second Load Guarantee',
    'Enterprise Edge Uptime',
    '4 New Partners Monthly'
];

const AdminLoader = () => (
    <div className="min-h-[50vh] flex items-center justify-center w-full">
        <div className="text-[11px] font-mono text-secondary uppercase tracking-widest animate-pulse border border-subtle px-4 py-2 bg-white/5">
            Loading System Module...
        </div>
    </div>
);

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);
    return null;
};

const App: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

        const timer = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [location.pathname]);

    return (
        <div className="min-h-screen relative flex flex-col font-inter bg-background text-primary selection:bg-[var(--accent)] selection:text-white">
            <ScrollToTop />
            <BackgroundAtmosphere />

            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${isScrolled ? 'bg-[#060708] border-b border-white/5 shadow-sm shadow-black/20' : 'bg-[#060708]/90 border-b border-white/5'}`}>
                <div className="max-w-[1400px] mx-auto px-6 h-20 grid grid-cols-[1fr_auto] md:grid-cols-3 items-center gap-6">
                    <Link to="/" className="flex items-center gap-3 group focus-visible:ring-offset-background min-h-[48px]">
                        <BrandLockup
                            logoSize="h-[22px] lg:h-[24px] w-auto opacity-90 group-hover:opacity-100 transition-all duration-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            textSize="text-[17px] lg:text-[19px] font-bold tracking-[0.1em] group-hover:text-white transition-all duration-500 drop-shadow-sm group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        />
                    </Link>

                    <div className="hidden md:flex items-center justify-center gap-8 text-[13px] font-medium text-secondary">
                        <Link to="/" className="min-h-[48px] inline-flex items-center py-2 hover:text-primary transition-colors">Home</Link>
                        <Link to="/services" className="min-h-[48px] inline-flex items-center py-2 hover:text-primary transition-colors">Infrastructure</Link>
                        <Link to="/concepts" className="min-h-[48px] inline-flex items-center py-2 hover:text-primary transition-colors">Concepts</Link>
                        <Link to="/contact" className="min-h-[48px] inline-flex items-center py-2 hover:text-primary transition-colors">Apply</Link>
                    </div>

                    <Link
                        to="/contact"
                        aria-label="Apply for strategy call"
                        className="justify-self-end inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-white text-black hover:bg-[#e2e2e2] text-[10px] font-bold uppercase tracking-[0.08em] border border-transparent transition-all duration-300 rounded-[2px]"
                    >
                        Book a Strategy Call
                    </Link>
                </div>

                <div className="md:hidden border-t border-white/5">
                    <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center justify-center gap-6 text-[12px] font-medium text-secondary">
                        <Link to="/" className="min-h-[48px] inline-flex items-center py-2 hover:text-primary transition-colors">Home</Link>
                        <Link to="/services" className="min-h-[48px] inline-flex items-center py-2 hover:text-primary transition-colors">Infrastructure</Link>
                        <Link to="/concepts" className="min-h-[48px] inline-flex items-center py-2 hover:text-primary transition-colors">Concepts</Link>
                        <Link to="/contact" className="min-h-[48px] inline-flex items-center py-2 hover:text-primary transition-colors">Apply</Link>
                    </div>
                </div>

                <div className="border-t border-white/5 bg-[#080a0c]/95">
                    <div className="max-w-[1400px] mx-auto px-6 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                        {globalTrustSignals.map((signal) => (
                            <span key={signal} className="text-[10px] font-mono uppercase tracking-widest text-secondary/90">
                                {signal}
                            </span>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Trust Badge Strip */}
            <div className="fixed top-0 w-full z-40 pointer-events-none" style={{ marginTop: 'calc(5rem + 1px)' }}>
                <div className="bg-[#0a0b0d]/95 backdrop-blur-sm border-b border-[#1e2028]">
                    <div className="max-w-[1400px] mx-auto px-6 py-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 pointer-events-auto">
                        {[
                            { badge: 'Cloudflare Enterprise Network', tip: 'Deployed across 300+ edge cities worldwide' },
                            { badge: 'HSTS Preload Active', tip: 'Browser-enforced encrypted connections' },
                            { badge: 'WCAG 2.1 Compliant', tip: 'Universal accessibility standard' },
                            { badge: 'SSL A+ Rated', tip: 'Bank-level encryption on every request' },
                        ].map((item) => (
                            <span key={item.badge} className="group relative text-[9px] font-mono uppercase tracking-[0.15em] text-[var(--text-secondary)]/50 hover:text-[var(--text-secondary)] transition-colors cursor-default flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500/40 group-hover:bg-emerald-400 transition-colors"></span>
                                {item.badge}
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#1a1d25] text-[var(--text-secondary)] text-[10px] font-mono px-3 py-1.5 rounded-md border border-[#2a2d35] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    {item.tip}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-1 flex flex-col">
                <Suspense fallback={<AdminLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/concepts" element={<ConceptsPage />} />
                        <Route path="/work" element={<Navigate to="/concepts" replace />} />
                        <Route path="/work/:slug" element={<WorkCaseStudyPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/audit" element={<AuditPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/manifesto" element={<Manifesto />} />

                        <Route path="/login" element={<Navigate to="/" replace />} />
                        <Route path="/admin/login" element={<Login />} />
                        <Route path="/mission" element={<Navigate to="/services" replace />} />
                        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                        <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
                        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
                        <Route path="/leads/:id" element={<ProtectedRoute><LeadDetail /></ProtectedRoute>} />
                        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                        <Route path="/admin/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
                        <Route path="/admin/inquiries/:id" element={<ProtectedRoute><InquiryDetail /></ProtectedRoute>} />
                    </Routes>
                </Suspense>
            </main>

            <footer className="bg-[#0B0B0C] pt-12 pb-28 md:pb-12 px-6 border-t border-[#1e2028]">
                <div className="max-w-[1100px] mx-auto">
                    {/* Brand + Navigation */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                        <BrandLockup
                            opacity="opacity-40 hover:opacity-100 transition-opacity duration-500"
                            logoSize="h-[18px] w-auto grayscale hover:grayscale-0 transition-all drop-shadow-sm"
                            textSize="text-[12px] uppercase text-primary"
                        />
                        <div className="flex items-center gap-6 text-[11px] font-mono uppercase tracking-widest text-secondary/60">
                            <Link to="/privacy" className="min-h-[48px] inline-flex items-center hover:text-primary transition-colors duration-300">Privacy</Link>
                            <Link to="/terms" className="min-h-[48px] inline-flex items-center hover:text-primary transition-colors duration-300">Terms</Link>
                            <Link to="/admin/login" className="min-h-[48px] inline-flex items-center hover:text-primary transition-colors duration-300">Client Portal</Link>
                        </div>
                    </div>

                    {/* Brand Statement */}
                    <div className="mt-6 pt-6 border-t border-[#1e2028] flex flex-col gap-3 items-center">
                        <p className="text-[12px] text-[var(--text-secondary)]/40 leading-relaxed text-center max-w-2xl mx-auto">
                            Axiom Infrastructure is a performance-first engineering firm. We do not use templates, DIY builders, or shared hosting.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-mono text-[var(--text-secondary)]/40 uppercase tracking-widest">
                            <span>Engineered in Kitchener, Ontario</span>
                            <span className="hidden sm:inline">·</span>
                            <a href="tel:+15195550198" className="hover:text-white transition-colors min-h-[48px] inline-flex items-center">(519) 555-0198</a>
                        </div>
                    </div>

                    {/* Copyright + Status */}
                    <div className="mt-6 pt-6 border-t border-[#1e2028] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[11px] font-mono text-[var(--text-secondary)]/50 uppercase tracking-widest">
                            © {new Date().getFullYear()} Axiom Infrastructure
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-mono text-[var(--text-secondary)]/50 uppercase tracking-widest">All systems operational</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Mobile-only sticky Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[var(--bg-main)]/85 backdrop-blur-xl border-t border-[var(--border-subtle)] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                <div className="grid grid-cols-4 px-2 py-1.5">
                    <Link to="/" className="flex flex-col items-center justify-center gap-1.5 py-1.5 text-[var(--text-secondary)] hover:text-white transition-colors min-h-[48px]">
                        <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span className="text-[9px] font-semibold uppercase tracking-widest">Home</span>
                    </Link>
                    <Link to="/services" className="flex flex-col items-center justify-center gap-1.5 py-1.5 text-[var(--text-secondary)] hover:text-white transition-colors min-h-[48px]">
                        <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        <span className="text-[9px] font-semibold uppercase tracking-widest">Services</span>
                    </Link>
                    <Link to="/manifesto" className="flex flex-col items-center justify-center gap-1.5 py-1.5 text-[var(--text-secondary)] hover:text-white transition-colors min-h-[48px]">
                        <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span className="text-[9px] font-semibold uppercase tracking-widest">Manifesto</span>
                    </Link>
                    <Link to="/contact" className="flex flex-col items-center justify-center gap-1.5 py-1.5 text-[var(--accent)] transition-colors min-h-[48px]">
                        <svg className="w-[20px] h-[20px] drop-shadow-[0_0_8px_rgba(255,103,0,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span className="text-[9px] font-bold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,103,0,0.3)]">Apply</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default App;
