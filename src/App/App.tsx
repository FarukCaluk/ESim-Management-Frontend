import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from '../pages/login-page';
import { SimCardsTable } from '../components/SimCards/sim-cards-table';
import { UserTable } from '../components/Users/user-table';
import PrivateRoute from '../components/private-route';
import RoleBasedRoute from '../components/RoleBasedRoute';
import MainLayout from '../components/Layout/MainLayout';
import UserProfile from '../components/Users/user-profile';
import { UserRole } from '../constants/roles';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route (public) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes - accessible to all authenticated users */}
        <Route
          path="/simcards"
          element={
            <PrivateRoute>
              <MainLayout>
                <h1>SIM Cards</h1>
                <SimCardsTable />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Admin-only routes - role-based protection */}
        <Route
          path="/users"
          element={
            <RoleBasedRoute allowedRoles={[UserRole.ADMIN]}>
              <MainLayout>
                <h1>Users</h1>
                <UserTable />
              </MainLayout>
            </RoleBasedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RoleBasedRoute allowedRoles={[UserRole.ADMIN]}>
              <MainLayout>
                <UserProfile />
              </MainLayout>
            </RoleBasedRoute>
          }
        />

        {/* Default: redirect to /login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
