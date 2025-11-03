import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../../components/layout/mainlayout';
import Dashboard from './dashboard/dashboard';

const UserRouter: React.FC = () => (
  <MainLayout>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </MainLayout>
);

export default UserRouter;
