# Role-Based Routing Guide

This document explains how role-based access control (RBAC) is implemented in the ESim Management Frontend.

## Overview

The application implements role-based routing to restrict access to certain features based on user roles. This ensures that sensitive operations (like user management) are only accessible to authorized users.

## User Roles

The application defines three user roles:

```typescript
export enum UserRole {
  ADMIN = 'Admin',    // Full access to all features
  USER = 'User',      // Access to basic features
  GUEST = 'Guest',    // Limited access (if implemented)
}
```

### Role Hierarchy

- **Admin**: Can access all routes, including user management and system administration
- **User**: Can access SIM card management and basic features
- **Guest**: Limited access (placeholder for future implementation)

## Route Protection Components

### PrivateRoute

Protects routes that require authentication (any logged-in user).

**Usage:**
```tsx
import PrivateRoute from './components/private-route';

<Route
  path="/simcards"
  element={
    <PrivateRoute>
      <MainLayout>
        <SimCardsTable />
      </MainLayout>
    </PrivateRoute>
  }
/>
```

**Behavior:**
- If user has a valid token → Allow access
- If user is not authenticated → Redirect to `/login`

### RoleBasedRoute

Protects routes based on specific user roles.

**Usage:**
```tsx
import RoleBasedRoute from './components/RoleBasedRoute';
import { UserRole } from './constants/roles';

<Route
  path="/users"
  element={
    <RoleBasedRoute allowedRoles={[UserRole.ADMIN]}>
      <MainLayout>
        <UserTable />
      </MainLayout>
    </RoleBasedRoute>
  }
/>
```

**Behavior:**
- If user is not authenticated → Redirect to `/login`
- If user doesn't have required role → Redirect to `/simcards` (default route)
- If user has required role → Allow access

## Current Route Configuration

### Public Routes
- `/login` - Login page (accessible to everyone)

### Protected Routes (Any authenticated user)
- `/simcards` - SIM Cards management

### Admin-Only Routes
- `/users` - User list and management
- `/users/:id` - User profile details

## Authentication Flow

1. User visits protected route
2. System checks for authentication token in localStorage
3. If not authenticated → Redirect to login
4. If authenticated → Check user role
5. If role matches requirements → Grant access
6. If role doesn't match → Redirect to default route

## Implementation Details

### Storing User Information

User information is stored in localStorage after successful login:

```typescript
localStorage.setItem('token', data.access_token);
localStorage.setItem('userRole', data.user?.type || 'User');
localStorage.setItem('isAdmin', data.user?.type === 'Admin' ? 'true' : 'false');
```

### Utility Functions

The application provides utility functions in `src/utils/auth.ts`:

```typescript
import { getUserRole, isAuthenticated, isAdmin, clearAuth } from '../utils/auth';

// Check if user is authenticated
if (isAuthenticated()) {
  // User has valid token
}

// Get current user role
const role = getUserRole(); // Returns 'Admin' | 'User' | null

// Check if user is admin
if (isAdmin()) {
  // Show admin features
}

// Clear authentication data (logout)
clearAuth();
```

### Role Helper Functions

The `src/constants/roles.ts` file provides helper functions:

```typescript
import { hasRole, hasAnyRole, UserRole } from '../constants/roles';

// Check if user has specific role
if (hasRole(userRole, UserRole.ADMIN)) {
  // User is admin
}

// Check if user has any of the specified roles
if (hasAnyRole(userRole, [UserRole.ADMIN, UserRole.USER])) {
  // User is admin or regular user
}
```

## Adding Role-Based Features

### 1. Conditional UI Elements

Show/hide UI elements based on user role:

```tsx
import { isAdmin } from '../utils/auth';

const MyComponent = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      {isAdmin() && (
        <Button onClick={handleAdminAction}>
          Admin Only Action
        </Button>
      )}
    </div>
  );
};
```

### 2. Conditional Navigation

Show navigation items based on role:

```tsx
import { getUserRole } from '../utils/auth';
import { UserRole } from '../constants/roles';

const Sidebar = () => {
  const userRole = getUserRole();
  
  return (
    <Nav>
      <Nav.Link to="/simcards">SIM Cards</Nav.Link>
      {userRole === UserRole.ADMIN && (
        <Nav.Link to="/users">Users</Nav.Link>
      )}
    </Nav>
  );
};
```

### 3. Protected API Calls

Protect API calls based on role:

```typescript
import { isAdmin } from '../utils/auth';

const deleteUser = async (userId: string) => {
  if (!isAdmin()) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  // Proceed with API call
  return await api.delete(`/users/${userId}`);
};
```

## Adding New Roles

### 1. Update Role Enum

Add the new role to `src/constants/roles.ts`:

```typescript
export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
  MODERATOR = 'Moderator', // New role
  GUEST = 'Guest',
}
```

### 2. Update Backend

Ensure your backend API returns the correct role in the login response:

```json
{
  "access_token": "...",
  "user": {
    "type": "Moderator"
  }
}
```

### 3. Apply Role Protection

Use the new role in RoleBasedRoute:

```tsx
<RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR]}>
  <ModeratorPanel />
</RoleBasedRoute>
```

## Security Considerations

### Client-Side Security

⚠️ **Important**: Client-side route protection is for UX purposes only. It prevents users from accidentally accessing unauthorized areas but does NOT provide security.

### Server-Side Security

✅ **Always implement authorization on the backend:**

```typescript
// Backend API should verify roles
app.delete('/api/users/:id', requireAdmin, async (req, res) => {
  // Delete user logic
});
```

### Token Validation

- Tokens should have expiration times
- Implement token refresh mechanisms
- Validate tokens on every API request
- Clear tokens on logout

### Best Practices

1. **Never trust client-side data**: Always validate on the server
2. **Use HTTPS**: Protect tokens in transit
3. **Implement token expiration**: Tokens should not last forever
4. **Log access attempts**: Monitor unauthorized access attempts
5. **Use secure storage**: Consider more secure alternatives to localStorage for tokens

## Testing Role-Based Access

### Manual Testing

1. Create test accounts with different roles
2. Log in with each account
3. Verify:
   - Correct routes are accessible
   - Unauthorized routes redirect properly
   - UI elements show/hide correctly

### Automated Testing

```tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('admin can access users page', () => {
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('userRole', 'Admin');
  
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Assert admin features are visible
});

test('regular user cannot access users page', () => {
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('userRole', 'User');
  
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Assert user is redirected or sees appropriate message
});
```

## Troubleshooting

### User Can't Access Expected Routes

1. Check localStorage for correct token and role
2. Verify role matches exactly (case-sensitive)
3. Check route configuration in App.tsx
4. Verify backend returns correct role

### Infinite Redirect Loop

1. Ensure login page is in PUBLIC_ROUTES
2. Check that default redirect route exists
3. Verify token is correctly stored

### Role Not Persisting

1. Check localStorage is not being cleared
2. Verify login response includes user role
3. Check for typos in localStorage keys

## References

- [React Router Documentation](https://reactrouter.com/)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
