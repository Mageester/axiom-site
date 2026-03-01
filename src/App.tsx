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

            <footer className="bg-[#0B0B0C] py-12 px-6 border-t border-[#1e2028]">
                <div className="max-w-[1100px] mx-auto">
                    {/* Brand + Navigation */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                        <BrandLockup
                            opacity="opacity-40 hover:opacity-100 transition-opacity duration-500"
                            logoSize="h-[18px] w-auto grayscale hover:grayscale-0 transition-all drop-shadow-sm"
                            textSize="text-[12px] uppercase text-primary"
                        />
                        <div className="flex items-center gap-6 text-[11px] font-mono uppercase tracking-widest text-secondary/60">
                            <Link to="/privacy" className="py-2 hover:text-primary transition-colors duration-300">Privacy</Link>
                            <Link to="/terms" className="py-2 hover:text-primary transition-colors duration-300">Terms</Link>
                            <Link to="/admin/login" className="py-2 hover:text-primary transition-colors duration-300">Client Portal</Link>
                        </div>
                    </div>

                    {/* Brand Statement */}
                    <div className="mt-6 pt-6 border-t border-[#1e2028]">
                        <p className="text-[12px] text-[var(--text-secondary)]/40 leading-relaxed text-center max-w-2xl mx-auto">
                            Axiom Infrastructure is a performance-first engineering firm. We do not use templates, DIY builders, or shared hosting.
                        </p>
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

            {/* Mobile-only sticky CTA */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0B0B0C]/95 backdrop-blur-sm border-t border-[#1e2028] px-4 py-3 safe-area-bottom">
                <Link
                    to="/contact"
                    className="flex items-center justify-center w-full min-h-[52px] bg-white text-[#0B0B0C] text-[12px] font-bold uppercase tracking-widest rounded-[4px] shadow-[0_0_20px_rgba(255,255,255,0.1)] active:bg-[#e2e2e2] transition-colors"
                >
                    Apply for Authority Build
                </Link>
            </div>
        </div>
    );
};

export default App;
