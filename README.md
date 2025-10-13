# eSIM Management Frontend

This is the **frontend** for the eSIM Management project, built with **React** and **Bootstrap**. It includes:

* **Users table** – displays user data from the backend (Admin only)
* **SIM Cards table** – displays SIM card information
* **Role-based routing** – protects routes based on user roles (Admin, User, Guest)
* **Internationalization (i18n)** – supports multiple languages (English, German) with language switcher
* **API integration** – uses a generic `useAPI` hook

---

## Project Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

* Node.js >= 18
* npm >= 9

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page reloads on edits, and lint errors appear in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production into the `build` folder.
Optimizes the build and minifies files for best performance.

### `npm run format`

Formats code using Prettier.

### `npm run lint`

Lints TypeScript files using ESLint.

### `npm run eject`

⚠️ **Warning:** This is a one-way operation.
It copies all build configuration files into your project, giving full control over webpack, Babel, ESLint, etc. Only use if you need custom build configuration.

---

## Project Structure

```
src/
├─ api/
│  ├─ hooks/            # Custom React hooks (useAPI)
│  ├─ models/           # API calls per entity (User, SimCard)
│  ├─ api-client.ts     # Axios client configuration
│  └─ common-api.ts     # Common API utilities
├─ App/
│  └─ App.tsx           # Main app component with routes
├─ components/
│  ├─ Layout/           # Layout components (Header, Sidebar, MainLayout)
│  ├─ Users/            # User-related components (UserTable, UserProfile)
│  ├─ SimCards/         # SIM Card components (SimCardsTable)
│  ├─ private-route.tsx # Protected route wrapper (authentication)
│  └─ RoleBasedRoute.tsx # Role-based route wrapper (authorization)
├─ constants/
│  └─ roles.ts          # User role definitions and utilities
├─ i18n/
│  ├─ locales/
│  │  ├─ en/            # English translations (common, auth, users, simcards)
│  │  └─ de/            # German translations (common, auth, users, simcards)
│  └─ config.ts         # i18n configuration
├─ pages/
│  └─ login-page.tsx    # Login page component
├─ types/               # TypeScript type definitions
├─ utils/               # Utility functions (placeholder for future use)
└─ index.tsx            # Application entry point
```

---

## Features

### 1. Role-Based Route Protection

The application implements role-based access control with two types of route protection:

#### PrivateRoute
Protects routes that require authentication (any logged-in user):

```tsx
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

#### RoleBasedRoute
Protects routes based on specific user roles:

```tsx
<RoleBasedRoute allowedRoles={[UserRole.ADMIN]}>
  <AdminPanel />
</RoleBasedRoute>
```

**User Roles:**
- `Admin` – Full access to all features including user management
- `User` – Access to SIM cards and basic features
- `Guest` – Limited access (if implemented)

**Usage Example:**
```tsx
// In App.tsx
<Route
  path="/users"
  element={
    <RoleBasedRoute allowedRoles={[UserRole.ADMIN]}>
      <MainLayout>
        <h1>Users</h1>
        <UserTable />
      </MainLayout>
    </RoleBasedRoute>
  }
/>
```

### 2. Internationalization (i18n)

The application uses **react-i18next** for internationalization with translations organized by module.

**Supported Languages:**
- English (en)
- German (de)

**Translation Modules:**
- `common` – Common UI elements (buttons, labels, etc.)
- `auth` – Authentication-related text (login, errors)
- `users` – User management text
- `simcards` – SIM card management text

**Usage in Components:**
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common:appName')}</h1>
      <p>{t('users:title')}</p>
    </div>
  );
};
```

**Adding New Translations:**
1. Add the translation key to the corresponding JSON file in `src/i18n/locales/[language]/[module].json`
2. Update the type definitions in `src/react-i18next.d.ts` if using TypeScript strict mode
3. Use the translation in your component with `t('module:key')`

**Language Switching:**
Users can switch languages using the dropdown in the header. The selected language is persisted in localStorage.

### 3. Authentication Flow

1. User visits the application
2. If not authenticated, redirected to `/login`
3. User logs in with email and password
4. Backend returns JWT token and user information
5. Token and user role are stored in localStorage
6. User is redirected to `/simcards` (default protected route)
7. Navigation menu shows routes based on user role

---

## API Integration

The application uses a generic `useAPI` hook for data fetching:

```tsx
import { useAPI } from '../api/hooks/use-api';
import { getUsers } from '../api/models/user-model';

const { data, loading, error } = useAPI<User[]>(getUsers);
```

---

## Learn More

* [React documentation](https://reactjs.org/)
* [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
* [react-i18next documentation](https://react.i18next.com/)
* [React Router documentation](https://reactrouter.com/)

