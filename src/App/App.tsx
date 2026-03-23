import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../styles/globals.css';
import AdminRouter from '../pages/admin';
import SupportRouter from '../pages/support';
import AgencyRouter from '../pages/agency';
import UserRouter from '../pages/user';
import AnonymousRouter from '../pages/anonymous';
import Logout from '../pages/anonymous/logout/Logout';
import { Role } from '../types/roles';
import { localStorageHelper, StorageKey } from '../utils/localstorage.helper';
import { getProfile } from '../api/profile';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<unknown>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorageHelper.get<string>(StorageKey.Token);
      if (token) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsReady(true);
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
