import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { BrandLockup } from './components/BrandLockup';

import Home from './pages/Home';
import Mission from './pages/Mission';
import Login from './pages/admin/Login';
import Account from './pages/admin/Account';
import Campaigns from './pages/admin/Campaigns';
import Leads from './pages/admin/Leads';
import LeadDetail from './pages/admin/LeadDetail';
import Jobs from './pages/admin/Jobs';

import ProtectedRoute from './components/ProtectedRoute';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Scroll tracking for nav transparency
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Global scroll reveal logic on route change
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

        // slight delay to allow rendering before observing
        const timer = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [location.pathname]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen relative flex flex-col font-inter bg-background text-primary selection:bg-[var(--accent)] selection:text-white">
            <ScrollToTop />
            <BackgroundAtmosphere />

            {/* NAV */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${isScrolled ? 'bg-[#060708] border-b border-subtle shadow-sm shadow-black/20' : 'bg-transparent border-b border-transparent'}`}>
                <div className="max-w-[1100px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group focus-visible:ring-offset-background">
                        <BrandLockup
                            logoSize="h-[18px] w-auto opacity-90 group-hover:opacity-100 transition-opacity"
                            textSize="text-[13px] group-hover:text-white transition-colors duration-300"
                        />
                    </Link>
                    <div className="hidden md:flex items-center gap-10 text-[13px] font-medium text-secondary">
                        <Link to="/mission" className="hover:text-primary transition-colors duration-300 focus-visible:text-primary">Mission</Link>
                        {isHome ? (
                            <>
                                <a href="#capabilities" className="hover:text-primary transition-colors duration-300 focus-visible:text-primary">Capabilities</a>
                                <a href="#engagement" className="hover:text-primary transition-colors duration-300 focus-visible:text-primary">Engagement</a>
                                <a href="#standards" className="hover:text-primary transition-colors duration-300 focus-visible:text-primary">Standards</a>
                            </>
                        ) : null}
                        <Link to="/#contact" className="hover:text-primary transition-colors duration-300 focus-visible:text-primary">Contact</Link>
                    </div>

                    <button
                        className="md:hidden text-secondary hover:text-primary p-2 -mr-2 transition-colors"
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

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#0a0c0e] border-b border-subtle absolute top-20 left-0 w-full px-6 py-4 flex flex-col gap-4 text-sm font-medium text-secondary shadow-xl">
                        <Link to="/mission" onClick={() => setMobileMenuOpen(false)}>Mission</Link>
                        {isHome && (
                            <>
                                <a href="#capabilities" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
                                <a href="#engagement" onClick={() => setMobileMenuOpen(false)}>Engagement</a>
                                <a href="#standards" onClick={() => setMobileMenuOpen(false)}>Standards</a>
                            </>
                        )}
                        <Link to="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                    </div>
                )}
            </nav>

            <main className="flex-1 flex flex-col">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mission" element={<Mission />} />

                    {/* Secure Admin Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                    <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
                    <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
                    <Route path="/leads/:id" element={<ProtectedRoute><LeadDetail /></ProtectedRoute>} />
                    <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                </Routes>
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
                        <span className="tracking-widest uppercase text-[10px] opacity-60">Ontario, Canada</span>
                        <a href="mailto:contact@axiominfrastructure.com" className="hover:text-primary transition-colors duration-300 tracking-tight">contact@axiominfrastructure.com</a>
                    </div>
                </div>
                <div className="max-w-[1100px] mx-auto mt-16 flex justify-center md:justify-start">
                    <p className="text-[10px] text-secondary/40 font-mono uppercase tracking-[0.2em] border border-subtle px-4 py-2 bg-surface/30 rounded-sm shadow-inner">
                        Vertical AI Systems // Web Infrastructure // Discreet Delivery
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;
