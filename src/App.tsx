import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Architects from './pages/Architects';
import Deployments from './pages/Deployments';
import Home from './pages/Home';
import Infrastructure from './pages/Infrastructure';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="min-h-screen overflow-x-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/works" element={<Deployments />} />
          <Route path="/deployments" element={<Navigate to="/works" replace />} />
          <Route path="/architects" element={<Architects />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
