import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from '../pages/login-page';
import { SimCardsTable } from '../components/SimCards/sim-cards-table';
import { UserTable } from '../components/Users/user-table';
import PrivateRoute from '../components/private-route';

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
              <h1>SIM Cards</h1>
              <SimCardsTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <h1>Users</h1>
              <UserTable />
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
