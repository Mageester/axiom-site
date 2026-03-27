import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

const About = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Deployments = lazy(() => import('./pages/Deployments'));
const Infrastructure = lazy(() => import('./pages/Infrastructure'));
const WorkCaseStudyPage = lazy(() => import('./pages/WorkCaseStudyPage'));
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
  <div className="min-h-screen bg-[var(--axiom-base)]" aria-hidden />
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

const LegacyProcessRedirect: React.FC = () => <Navigate to="/process" replace />;

const LegacyWorkRedirect: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  return <Navigate to={slug ? `/work/${slug}` : '/work'} replace />;
};

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<OpsAwareHome />} />
          <Route path="/process" element={<Infrastructure />} />
          <Route path="/method" element={<LegacyProcessRedirect />} />
          <Route path="/infrastructure" element={<Navigate to="/process" replace />} />
          <Route path="/work" element={<Deployments />} />
          <Route path="/works" element={<LegacyWorkRedirect />} />
          <Route path="/work/:slug" element={<WorkCaseStudyPage />} />
          <Route path="/works/:slug" element={<LegacyWorkRedirect />} />
          <Route path="/deployments" element={<Navigate to="/work" replace />} />
          <Route path="/apply" element={<ContactPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/consultation" element={<Navigate to="/apply" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/architects" element={<Navigate to="/about" replace />} />
          <Route path="/admin/login" element={<Login />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
