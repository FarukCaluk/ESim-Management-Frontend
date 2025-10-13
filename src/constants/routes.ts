/**
 * Application route paths
 */
export const ROUTES = {
  LOGIN: '/login',
  SIMCARDS: '/simcards',
  USERS: '/users',
  USER_PROFILE: (id: string) => `/users/${id}`,
} as const;

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [ROUTES.LOGIN];

/**
 * Admin-only routes
 */
export const ADMIN_ROUTES = [ROUTES.USERS];
