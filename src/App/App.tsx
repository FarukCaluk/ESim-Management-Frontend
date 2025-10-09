import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from '../pages/login-page';
import { SimCardsTable } from '../pages/simcards/sim-cards-table';
import { UserTable } from '../pages/users/user-table';
import PrivateRoute from '../components/private-route';
import MainLayout from '../components/layout/mainlayout';
import UserProfile from '../components/users/user-profile';
import { PackagesTable } from '../pages/packages/packages-table';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route (public) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/simcards"
          element={
            <PrivateRoute allowedRoles={['admin', 'support', 'user']}>
              <MainLayout>
                <h1>SIM Cards</h1>
                <SimCardsTable />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <MainLayout>
                <h1>Users</h1>
                <UserTable />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <MainLayout>
                <UserProfile />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/packages"
          element={
            <PrivateRoute allowedRoles={['admin', 'support']}>
              <MainLayout>
                <h1>Packages</h1>
                <PackagesTable />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Default: redirect to /login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
