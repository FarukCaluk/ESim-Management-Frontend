import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminRouter from '../pages/admin';
import SupportRouter from '../pages/support';
import AgencyRouter from '../pages/agency';
import UserRouter from '../pages/user';
import AnonymousRouter from '../pages/anonymous';
import { Role } from '../types/roles';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = (localStorage.getItem('role') || null) as Role | null;
    const valid = !!token && token !== 'undefined' && token !== 'null' && token !== '';
    setIsLoggedIn(valid);
    setRole(storedRole);
  }, []);

  const handleLogin = (r: string) => {
    setIsLoggedIn(true);
    setRole(r as Role);
  };

  if (!isLoggedIn) {
    return (
      <Router>
        <AnonymousRouter onLogin={handleLogin} />
      </Router>
    );
  }

  switch (role) {
    case Role.Admin:
      return (
        <Router>
          <AdminRouter />
        </Router>
      );
    case Role.Support:
      return (
        <Router>
          <SupportRouter />
        </Router>
      );
    case Role.Agency:
      return (
        <Router>
          <AgencyRouter />
        </Router>
      );
    case Role.User:
      return (
        <Router>
          <UserRouter />
        </Router>
      );
    default:
      return (
        <Router>
          <AnonymousRouter onLogin={handleLogin} />
        </Router>
      );
  }
};

export default App;
