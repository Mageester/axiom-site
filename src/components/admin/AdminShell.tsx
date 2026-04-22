import React, { Suspense, lazy, useLayoutEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

const BUILD_REV = '2026-04-15-astro-static';
const Login = lazy(() => import('../../react-pages/admin/Login'));
const Account = lazy(() => import('../../react-pages/admin/Account'));
const Jobs = lazy(() => import('../../react-pages/admin/Jobs'));
const Inquiries = lazy(() => import('../../react-pages/admin/Inquiries'));
const InquiryDetail = lazy(() => import('../../react-pages/admin/InquiryDetail'));
const Dashboard = lazy(() => import('../../react-pages/admin/Dashboard'));
const Hunt = lazy(() => import('../../react-pages/admin/Hunt'));
const Vault = lazy(() => import('../../react-pages/admin/Vault'));
const Triage = lazy(() => import('../../react-pages/admin/Triage'));
const OmniscientLeadDetail = lazy(() => import('../../react-pages/admin/OmniscientLeadDetail'));
const OmniscientSettings = lazy(() => import('../../react-pages/admin/OmniscientSettings'));
const AuditPage = lazy(() => import('../../react-pages/AuditPage'));

const RouteFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--axiom-base)] px-6">
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_16px_36px_rgba(0,0,0,0.26)] md:p-8"
    >
      <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Loading admin</p>
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

const LegacyLeadRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/lead/${id}` : '/vault'} replace />;
};

const AdminRoutes: React.FC = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.setAttribute('data-axiom-build-rev', BUILD_REV);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
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
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

const AdminShell: React.FC = () => (
  <BrowserRouter>
    <AdminRoutes />
  </BrowserRouter>
);

export default AdminShell;
