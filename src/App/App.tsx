import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from '../pages/login-page';
import { SimCardsTable } from '../components/SimCards/sim-cards-table';
import { UserTable } from '../components/Users/user-table';
import PrivateRoute from '../components/private-route';
import MainLayout from '../components/Layout/MainLayout';
import UserProfile from '../components/Users/user-profile';

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
            <PrivateRoute>
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
            <PrivateRoute>
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
            <PrivateRoute>
              <MainLayout>
                <UserProfile />
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
