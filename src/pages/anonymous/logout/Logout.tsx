import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function clearCookies() {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0]?.trim();
    if (name) document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
}

export default function Logout() {
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL ?? ''}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    clearCookies();

    window.dispatchEvent(new Event('auth:changed'));
  }, []);

  return <Navigate to="/login" replace />;
}
