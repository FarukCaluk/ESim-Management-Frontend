import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login/login-page';

const AnonymousRouter: React.FC<{ onLogin?: (role: string) => void }> = ({ onLogin }) => (
  <Routes>
    <Route path="/login" element={<LoginPage onLogin={(r: any) => onLogin?.(r)} />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AnonymousRouter;
