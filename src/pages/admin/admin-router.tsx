import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../../components/layout/mainlayout';
import Dashboard from './dashboard/dashboard';
import { UserTable } from './users/user-table';
import UserProfile from './users/user-profile';
import { PackagesTable } from './packages/packages-table';
import { CollectionsTable } from './collections/collections-table';
import { PlansTable } from './plans/plans-table';
import { SimCardsTable } from './simcards/sim-cards-table';

const AdminRouter: React.FC = () => (
  <MainLayout>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/simcards" element={<SimCardsTable />} />
      <Route path="/users" element={<UserTable />} />
      <Route path="/users/:id" element={<UserProfile />} />
      <Route path="/packages" element={<PackagesTable />} />
      <Route path="/collections" element={<CollectionsTable />} />
      <Route path="/plans" element={<PlansTable />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </MainLayout>
);

export default AdminRouter;
