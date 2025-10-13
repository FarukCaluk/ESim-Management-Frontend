import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../constants/roles';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * RoleBasedRoute component for protecting routes based on user roles
 * 
 * @param children - The component to render if user has required role
 * @param allowedRoles - Array of roles that are allowed to access this route
 * @param redirectTo - Optional redirect path (defaults to /login)
 * 
 * @example
 * <RoleBasedRoute allowedRoles={[UserRole.ADMIN]}>
 *   <AdminPanel />
 * </RoleBasedRoute>
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Check if user is authenticated
  if (!token) {
    return <Navigate to={redirectTo} />;
  }

  // Check if user has one of the allowed roles
  if (userRole && allowedRoles.includes(userRole as UserRole)) {
    return <>{children}</>;
  }

  // User is authenticated but doesn't have required role
  // Redirect to unauthorized page or default route
  return <Navigate to="/simcards" />;
};

export default RoleBasedRoute;
