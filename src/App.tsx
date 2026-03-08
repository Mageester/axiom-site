import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Deployments = lazy(() => import('./pages/Deployments'));
const Infrastructure = lazy(() => import('./pages/Infrastructure'));
const WorkCaseStudyPage = lazy(() => import('./pages/WorkCaseStudyPage'));

const RouteFallback: React.FC = () => (
  <div className="min-h-screen bg-[var(--axiom-base)]" aria-hidden />
);

const App: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="min-h-screen overflow-x-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/works" element={<Deployments />} />
            <Route path="/works/:slug" element={<WorkCaseStudyPage />} />
            <Route path="/deployments" element={<Navigate to="/works" replace />} />
            <Route path="/apply" element={<ContactPage />} />
            <Route path="/contact" element={<Navigate to="/apply" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/architects" element={<Navigate to="/about" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
