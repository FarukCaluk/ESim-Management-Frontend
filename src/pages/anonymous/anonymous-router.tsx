import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login/login-page';

const AnonymousRouter: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AnonymousRouter;
