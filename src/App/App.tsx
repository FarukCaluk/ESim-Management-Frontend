import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminRouter from '../pages/admin';
import SupportRouter from '../pages/support';
import AgencyRouter from '../pages/agency';
import UserRouter from '../pages/user';
import AnonymousRouter from '../pages/anonymous';
import Logout from '../pages/logout/Logout';
import { Role } from '../types/roles';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const syncAuth = () => {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const storedRole = (sessionStorage.getItem('role') ||
        localStorage.getItem('role') ||
        null) as Role | null;
      const valid = !!token && token !== 'undefined' && token !== 'null' && token !== '';
      setIsLoggedIn(valid);
      setRole(valid ? storedRole : null);
    };

    syncAuth();
    window.addEventListener('storage', syncAuth);
    window.addEventListener('app:auth-change', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('app:auth-change', syncAuth);
    };
  }, []);

  const handleLogin = (r: string) => {
    setIsLoggedIn(true);
    setRole(r as Role);
  };

  let RoutesElement: React.ReactNode;
  if (!isLoggedIn) {
    RoutesElement = <AnonymousRouter onLogin={handleLogin} />;
  } else {
    switch (role) {
      case Role.Admin:
        RoutesElement = <AdminRouter />;
        break;
      case Role.Support:
        RoutesElement = <SupportRouter />;
        break;
      case Role.Agency:
        RoutesElement = <AgencyRouter />;
        break;
      case Role.User:
        RoutesElement = <UserRouter />;
        break;
      default:
        RoutesElement = <AnonymousRouter onLogin={handleLogin} />;
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="/*" element={RoutesElement} />
      </Routes>
    </Router>
  );
};

export default App;
