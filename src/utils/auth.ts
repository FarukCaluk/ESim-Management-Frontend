/**
 * Utility functions for the ESim Management application
 */

/**
 * Get user's role from localStorage
 * @returns User role or null if not found
 */
export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

/**
 * Get authentication token from localStorage
 * @returns Token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns true if user has a valid token
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Check if user is admin
 * @returns true if user role is Admin
 */
export const isAdmin = (): boolean => {
  return getUserRole() === 'Admin';
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isAdmin');
};
