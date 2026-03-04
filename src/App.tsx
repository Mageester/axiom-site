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

const publicNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Infrastructure' },
    { to: '/concepts', label: 'Concepts' },
    { to: '/contact', label: 'Apply' }
];

const AdminLoader = () => (
    <div className="min-h-[50vh] flex items-center justify-center w-full">
        <div className="text-[11px] font-mono text-axiom-text-mute uppercase tracking-widest animate-pulse border border-axiom-border px-4 py-2 bg-axiom-surface/60">
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.querySelectorAll<HTMLElement>('section h2, section h3, section .axiom-reading-measure').forEach((el) => {
            el.classList.add('reveal');
        });

        const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .axiom-bento'));
        targets.forEach((el, index) => {
            el.style.setProperty('--reveal-delay', `${(index % 6) * 100}ms`);
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            targets.forEach((el) => {
                el.classList.add('active');
                el.classList.add('is-visible');
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

        const timer = setTimeout(() => {
            targets.forEach((el) => observer.observe(el));
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [location.pathname]);

    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll<HTMLElement>('.btn-primary, .magnetic-primary'));
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            nodes.forEach((node) => {
                node.style.setProperty('--mx', '0px');
                node.style.setProperty('--my', '0px');
            });
            return;
        }

        const radius = 50;
        const maxShift = 5;
        const onMove = (event: MouseEvent) => {
            nodes.forEach((node) => {
                const rect = node.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = event.clientX - cx;
                const dy = event.clientY - cy;
                const distance = Math.hypot(dx, dy);
                if (distance <= radius) {
                    const power = 1 - distance / radius;
                    node.style.setProperty('--mx', `${(dx / radius) * maxShift * power}px`);
                    node.style.setProperty('--my', `${(dy / radius) * maxShift * power}px`);
                    return;
                }
                node.style.setProperty('--mx', '0px');
                node.style.setProperty('--my', '0px');
            });
        };
        const reset = () => {
            nodes.forEach((node) => {
                node.style.setProperty('--mx', '0px');
                node.style.setProperty('--my', '0px');
            });
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', reset);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', reset);
        };
    }, [location.pathname]);

    return (
        <div className="min-h-screen relative flex flex-col font-inter bg-axiom-base text-axiom-text-main selection:bg-[var(--accent)] selection:text-axiom-text-main">
            <ScrollToTop />
            <BackgroundAtmosphere />

            <nav className="fixed top-0 left-0 w-full z-50 border-b border-axiom-border bg-axiom-base/92 backdrop-blur-xl">
                <div className={`axiom-shell-inner h-20 px-6 md:px-10 xl:px-20 grid grid-cols-[1fr_auto_auto] md:grid-cols-3 items-center gap-4 transition-all duration-300 ease-out ${isScrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.35)]' : ''}`}>
                    <Link to="/" className="flex items-center gap-3 group focus-visible:ring-offset-background min-h-[48px]">
                        <BrandLockup
                            logoSize="h-[22px] lg:h-[24px] w-auto opacity-95 group-hover:opacity-100 transition-all duration-300"
                            textSize="text-[16px] lg:text-[18px] font-semibold tracking-[0.08em] group-hover:text-axiom-text-main transition-colors duration-300"
                        />
                    </Link>

                    <div className="hidden md:flex items-center justify-center gap-8 text-[12px] font-medium uppercase tracking-[0.12em] text-axiom-text-mute">
                        {publicNavLinks.map((item) => (
                            <Link key={item.to} to={item.to} className="min-h-[48px] inline-flex items-center py-2 hover:text-axiom-text-main transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <Link
                        to="/contact"
                        aria-label="Apply for strategy call"
                        className="hidden md:inline-flex justify-self-end self-center btn-primary btn-md min-w-[180px]"
                    >
                        Book a Strategy Call
                    </Link>

                    <button
                        type="button"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen((open) => !open)}
                        className="md:hidden justify-self-end min-h-[44px] min-w-[44px] inline-flex items-center justify-center border border-axiom-border rounded-md text-axiom-text-main"
                    >
                        <span className="font-axiomMono text-[11px] uppercase tracking-[0.12em]">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-axiom-border bg-axiom-elevated/98">
                        <div className="axiom-shell-inner px-6 py-4 flex flex-col gap-2">
                            {publicNavLinks.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="min-h-[48px] inline-flex items-center px-2 font-axiomMono text-[11px] uppercase tracking-[0.14em] text-axiom-text-mute hover:text-axiom-text-main transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link to="/contact" className="btn-primary btn-md w-full mt-2">
                                Book Strategy Call
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1 flex flex-col axiom-grain">
                <Suspense fallback={<AdminLoader />}>
                    <div key={`${location.pathname}${location.search}`} className="route-fade">
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
                    </div>
                </Suspense>
            </main>
            <footer className="axiom-shell-section pt-12 pb-12 border-t border-axiom-border">
                <div className="axiom-shell-inner">
                    <div className="axiom-footer-grid">
                        <div className="axiom-bento">
                            <BrandLockup
                                opacity="opacity-90"
                                logoSize="h-[20px] w-auto grayscale-0 drop-shadow-sm"
                                textSize="text-[13px] uppercase text-axiom-text-main"
                            />
                            <p className="text-[12px] text-axiom-text-mute leading-relaxed mt-3">
                                Axiom Infrastructure is a performance-first engineering firm. We do not use templates, DIY builders, or shared hosting.
                            </p>
                        </div>
                        <div className="axiom-bento">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute mb-3">Operations</p>
                            <div className="flex flex-col gap-2 text-[12px] text-axiom-text-main">
                                <span>Engineered in Kitchener, Ontario</span>
                                <a href="tel:+15195550198" className="hover:text-axiom-text-main transition-colors min-h-[48px] inline-flex items-center">(519) 555-0198</a>
                            </div>
                        </div>
                        <div className="axiom-bento">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-axiom-text-mute mb-3">Legal</p>
                            <div className="flex flex-col gap-2 text-[11px] font-mono uppercase tracking-widest text-axiom-text-mute">
                                <Link to="/privacy" className="min-h-[48px] inline-flex items-center hover:text-axiom-text-main transition-colors duration-300">Privacy</Link>
                                <Link to="/terms" className="min-h-[48px] inline-flex items-center hover:text-axiom-text-main transition-colors duration-300">Terms</Link>
                                <Link to="/admin/login" className="min-h-[48px] inline-flex items-center hover:text-axiom-text-main transition-colors duration-300">Client Portal</Link>
                            </div>
                        </div>
                        <div className="axiom-bento">
                            <p className="text-[11px] font-mono text-axiom-text-mute uppercase tracking-widest">© {new Date().getFullYear()} Axiom Infrastructure</p>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="w-1.5 h-1.5 bg-axiom-accent rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-mono text-axiom-text-mute uppercase tracking-widest">All systems operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default App;




