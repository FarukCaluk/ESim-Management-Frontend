/**
 * User roles in the application
 */
export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
  GUEST = 'Guest',
}

/**
 * Check if a user has a specific role
 */
export const hasRole = (userRole: string | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  return userRole === requiredRole;
};

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (userRole: string | null, requiredRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole as UserRole);
};
