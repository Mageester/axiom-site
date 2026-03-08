import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import About from './pages/About';
import ContactPage from './pages/ContactPage';
import Deployments from './pages/Deployments';
import Home from './pages/Home';
import Infrastructure from './pages/Infrastructure';
import WorkCaseStudyPage from './pages/WorkCaseStudyPage';

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
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
