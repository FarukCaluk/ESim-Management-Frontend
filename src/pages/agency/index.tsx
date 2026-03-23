import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../../components/layout/mainlayout';
import Dashboard from './dashboard/dashboard';
import { CollectionsTable } from './collections/collections-table';
import { PlansTable } from './plans/plans-table';
import { SimCardsTable } from './simcards/sim-cards-table';

const AgencyRouter: React.FC = () => (
  <MainLayout>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/collections" element={<CollectionsTable />} />
      <Route path="/plans" element={<PlansTable />} />
      <Route path="/simcards" element={<SimCardsTable />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </MainLayout>
);

export default AgencyRouter;
