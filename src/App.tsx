import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { BrandLockup } from './components/BrandLockup';

import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import WorkPage from './pages/WorkPage';
import WorkCaseStudyPage from './pages/WorkCaseStudyPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';

// Admin System Imports - Lazy Loaded
const Login = lazy(() => import('./pages/admin/Login'));
const Account = lazy(() => import('./pages/admin/Account'));
const Campaigns = lazy(() => import('./pages/admin/Campaigns'));
const Leads = lazy(() => import('./pages/admin/Leads'));
const LeadDetail = lazy(() => import('./pages/admin/LeadDetail'));
const Jobs = lazy(() => import('./pages/admin/Jobs'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));
const InquiryDetail = lazy(() => import('./pages/admin/InquiryDetail'));

import ProtectedRoute from './components/ProtectedRoute';

const AdminLoader = () => (
    <div className="min-h-[50vh] flex items-center justify-center w-full">
        <div className="text-[11px] font-mono text-secondary uppercase tracking-widest animate-pulse border border-subtle px-4 py-2 bg-white/5">Loading System Module...</div>
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen relative flex flex-col font-inter bg-background text-primary selection:bg-[var(--accent)] selection:text-white">
            <ScrollToTop />
            <BackgroundAtmosphere />

            {/* NAV */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${isScrolled ? 'bg-[#060708] border-b border-white/5 shadow-sm shadow-black/20' : 'bg-transparent border-b border-white/5'}`}>
                <div className="max-w-[1400px] mx-auto px-6 h-20 grid grid-cols-3 items-center">

                    {/* Left: Nav Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-secondary justify-self-start">
                        <Link to="/" className="hover:text-primary transition-colors focus-visible:text-primary">Home</Link>
                        <Link to="/services" className="hover:text-primary transition-colors focus-visible:text-primary">Services</Link>
                        <Link to="/work" className="hover:text-primary transition-colors focus-visible:text-primary">Concepts</Link>
                        <Link to="/pricing" className="hover:text-primary transition-colors focus-visible:text-primary">Pricing</Link>
                        <Link to="/contact" className="hover:text-primary transition-colors focus-visible:text-primary">Contact</Link>
                    </div>

                    {/* Left Placeholder (Mobile) */}
                    <div className="lg:hidden justify-self-start"></div>

                    {/* Center: Branding */}
                    <Link to="/" className="flex items-center gap-3 group focus-visible:ring-offset-background justify-self-center">
                        <BrandLockup
                            logoSize="h-[22px] lg:h-[24px] w-auto opacity-90 group-hover:opacity-100 transition-all duration-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            textSize="text-[17px] lg:text-[19px] font-bold tracking-[0.1em] group-hover:text-white transition-all duration-500 drop-shadow-sm group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        />
                    </Link>

                    {/* Right: CTA (Desktop) */}
                    <div className="hidden lg:flex items-center justify-self-end">
                        <Link
                            to="/contact"
                            aria-label="Request a consultation"
                            className="px-6 py-2.5 bg-white text-black hover:bg-[#e2e2e2] text-[10px] font-bold uppercase tracking-[0.08em] border border-transparent transition-all duration-300 rounded-[2px]"
                        >
                            Request a Consultation
                        </Link>
                    </div>

                    {/* Right: Hamburger Nav (Mobile) */}
                    <div className="lg:hidden justify-self-end">
                        <button
                            className="text-secondary hover:text-primary p-2 -mr-2 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#0a0c0e] border-b border-subtle absolute top-20 left-0 w-full px-6 py-4 flex flex-col gap-4 text-sm font-medium text-secondary shadow-xl z-50">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link to="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
                        <Link to="/work" onClick={() => setMobileMenuOpen(false)}>Concepts</Link>
                        <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                        <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                        <Link
                            to="/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Request a consultation"
                            className="mt-2 inline-flex items-center justify-center px-4 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-[0.08em] rounded-[2px]"
                        >
                            Request a Consultation
                        </Link>
                    </div>
                )}
            </nav>

            <main className="flex-1 flex flex-col">
                <Suspense fallback={<AdminLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/work" element={<WorkPage />} />
                        <Route path="/work/:slug" element={<WorkCaseStudyPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/contact" element={<ContactPage />} />

                        {/* Secure Admin Routes */}
                        <Route path="/login" element={<Navigate to="/" replace />} />
                        <Route path="/admin/login" element={<Login />} />
                        {/* Old mission route redirects to services */}
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

            {/* FOOTER */}
            <footer className="bg-background py-16 px-6 border-t border-subtle">
                <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 group">
                    <div className="flex items-center gap-2">
                        <BrandLockup
                            opacity="opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                            logoSize="h-[18px] w-auto grayscale group-hover:grayscale-0 transition-all drop-shadow-sm"
                            textSize="text-[12px] uppercase text-primary"
                        />
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-2 text-[12px] text-secondary font-mono">
                        <span className="tracking-widest uppercase text-[10px] opacity-60">Professional Website Building</span>
                        <a href="mailto:contact@getaxiom.ca" className="hover:text-primary transition-colors duration-300 tracking-tight">contact@getaxiom.ca</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
