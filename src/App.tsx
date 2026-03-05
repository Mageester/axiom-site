import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Architects from './pages/Architects';
import Deployments from './pages/Deployments';
import Home from './pages/Home';
import Infrastructure from './pages/Infrastructure';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/infrastructure" element={<Infrastructure />} />
      <Route path="/deployments" element={<Deployments />} />
      <Route path="/architects" element={<Architects />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
