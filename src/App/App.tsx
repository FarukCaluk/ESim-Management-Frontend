import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminRouter from '../pages/admin/admin-router';
import SupportRouter from '../pages/support/support-router';
import AgencyRouter from '../pages/agency/agency-router';
import AnonymousRouter from '../pages/anonymous/anonymous-router';
import UserRouter from '../pages/user/user-router';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isLoggedIn = token && token !== 'undefined' && token !== 'null' && token !== '';

  return (
    <Router>
      {!isLoggedIn && <AnonymousRouter />}
      {isLoggedIn && role === 'admin' && <AdminRouter />}
      {isLoggedIn && role === 'support' && <SupportRouter />}
      {isLoggedIn && role === 'agency' && <AgencyRouter />}
      {isLoggedIn && role === 'user' && <UserRouter />}
    </Router>
  );
}

export default App;
