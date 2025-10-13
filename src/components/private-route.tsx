import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute component for protecting routes that require authentication
 * 
 * @param children - The component to render if user is authenticated
 * 
 * @example
 * <PrivateRoute>
 *   <Dashboard />
 * </PrivateRoute>
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to={ROUTES.LOGIN} />;
};

export default PrivateRoute;
