import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && (!role || !allowedRoles.includes(role))) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default PrivateRoute;
