import React, { Suspense, lazy, useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import AuditPage from './pages/AuditPage';
import ContactPage from './pages/ContactPage';
import Deployments from './pages/Deployments';
import Approach from './pages/Approach';
import Infrastructure from './pages/Infrastructure';
import NotFoundPage from './pages/NotFoundPage';
import PricingPage from './pages/PricingPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

const BUILD_REV = '2026-04-13-origin-cache-refresh';
const Login = lazy(() => import('./pages/admin/Login'));
const Account = lazy(() => import('./pages/admin/Account'));
const Jobs = lazy(() => import('./pages/admin/Jobs'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));
const InquiryDetail = lazy(() => import('./pages/admin/InquiryDetail'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Hunt = lazy(() => import('./pages/admin/Hunt'));
const Vault = lazy(() => import('./pages/admin/Vault'));
const Triage = lazy(() => import('./pages/admin/Triage'));
const OmniscientLeadDetail = lazy(() => import('./pages/admin/OmniscientLeadDetail'));
const OmniscientSettings = lazy(() => import('./pages/admin/OmniscientSettings'));

const RouteFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--axiom-base)] px-6">
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_16px_36px_rgba(0,0,0,0.26)] md:p-8"
    >
      <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Loading page</p>
      <div className="mt-4 h-10 w-64 max-w-full animate-pulse rounded bg-white/8" />
      <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/6" />
      <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/6" />
      <div className="mt-6 flex gap-3">
        <div className="h-11 w-36 animate-pulse rounded-full bg-white/8" />
        <div className="h-11 w-28 animate-pulse rounded-full bg-white/6" />
      </div>
    </div>
  </div>
);

const OpsAwareHome: React.FC = () => {
  if (typeof window !== 'undefined' && /^ops\./i.test(window.location.hostname)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Home />;
};

const LegacyLeadRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/lead/${id}` : '/vault'} replace />;
};

const App: React.FC = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.setAttribute('data-axiom-build-rev', BUILD_REV);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<OpsAwareHome />} />
          <Route path="/work" element={<Deployments />} />
          <Route path="/works" element={<Navigate to="/work" replace />} />
          <Route path="/works/:slug" element={<Navigate to="/work" replace />} />
          <Route path="/deployments" element={<Navigate to="/work" replace />} />
          <Route path="/concepts" element={<Navigate to="/work" replace />} />
          <Route path="/process" element={<Infrastructure />} />
          <Route path="/method" element={<Navigate to="/process" replace />} />
          <Route path="/infrastructure" element={<Navigate to="/process" replace />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/services" element={<Navigate to="/pricing" replace />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/our-approach" element={<Navigate to="/approach" replace />} />
          <Route path="/manifesto" element={<Navigate to="/approach" replace />} />
          <Route path="/start-a-project" element={<ContactPage />} />
          <Route path="/apply" element={<Navigate to="/start-a-project" replace />} />
          <Route path="/contact" element={<Navigate to="/start-a-project?type=question" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/architects" element={<Navigate to="/about" replace />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/audit" element={<ProtectedRoute><AuditPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/hunt" element={<ProtectedRoute><Hunt /></ProtectedRoute>} />
          <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
          <Route path="/triage" element={<ProtectedRoute><Triage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><OmniscientSettings /></ProtectedRoute>} />
          <Route path="/lead/:id" element={<ProtectedRoute><OmniscientLeadDetail /></ProtectedRoute>} />
          <Route path="/campaigns" element={<Navigate to="/hunt" replace />} />
          <Route path="/leads" element={<Navigate to="/vault" replace />} />
          <Route path="/leads/:id" element={<LegacyLeadRedirect />} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
          <Route path="/admin/inquiries/:id" element={<ProtectedRoute><InquiryDetail /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
