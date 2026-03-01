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

            <footer className="bg-background py-16 px-6 border-t border-subtle">
                <div className="max-w-[1100px] mx-auto">
                    <div className="surface-panel p-8 sm:p-10 rounded-sm text-center">
                        <p className="text-[11px] font-mono text-accent/80 uppercase tracking-widest mb-4">Risk Reversal</p>
                        <h2 className="text-[26px] sm:text-[34px] font-semibold text-primary tracking-tight mb-4">
                            Your site stays online when demand spikes.
                        </h2>
                        <p className="text-[15px] text-secondary leading-relaxed max-w-[760px] mx-auto mb-8">
                            We build on enterprise edge networks so your website does not crash during storms, heatwaves, or peak seasonal demand.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center min-h-[52px] px-8 py-4 bg-white hover:bg-white/90 text-black text-[12px] font-bold tracking-[0.05em] uppercase transition-all duration-300 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            Start Project Application
                        </Link>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-secondary/70 mt-5">
                            Limited Onboarding: 4 New Partners Per Month
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-5">
                        <BrandLockup
                            opacity="opacity-40 hover:opacity-100 transition-opacity duration-500"
                            logoSize="h-[18px] w-auto grayscale hover:grayscale-0 transition-all drop-shadow-sm"
                            textSize="text-[12px] uppercase text-primary"
                        />
                        <div className="flex items-center gap-6 text-[11px] font-mono uppercase tracking-widest text-secondary/60">
                            <Link to="/privacy" className="py-2 hover:text-primary transition-colors duration-300">Privacy</Link>
                            <Link to="/terms" className="py-2 hover:text-primary transition-colors duration-300">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
