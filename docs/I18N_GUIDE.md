# Internationalization (i18n) Guide

This document explains how to use and extend the internationalization features in the ESim Management Frontend.

## Overview

The application uses **react-i18next** for internationalization, with translations organized by module for better maintainability.

## Supported Languages

- **English (en)** - Default language
- **German (de)** - Secondary language

## Translation Structure

Translations are organized in the following structure:

```
src/i18n/
├── locales/
│   ├── en/
│   │   ├── common.json      # Common UI elements
│   │   ├── auth.json        # Authentication text
│   │   ├── users.json       # User management
│   │   └── simcards.json    # SIM card management
│   └── de/
│       ├── common.json
│       ├── auth.json
│       ├── users.json
│       └── simcards.json
└── config.ts                # i18n configuration
```

### Translation Modules

#### `common.json`
Contains common UI elements used across the application:
- App name
- Button labels (Save, Cancel, Delete, Edit)
- Common states (Yes, No, N/A, Loading, Error)
- Layout controls (Hide/Show Sidebar, Logout)

#### `auth.json`
Contains authentication-related text:
- Login form labels and placeholders
- Error messages
- Authorization messages

#### `users.json`
Contains user management text:
- Page titles
- Table headers
- Loading and error states

#### `simcards.json`
Contains SIM card management text:
- Page titles
- Table headers

## Using Translations in Components

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common:appName')}</h1>
      <button>{t('common:save')}</button>
    </div>
  );
};
```

### Using Multiple Namespaces

```tsx
const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('users:title')}</h1>
      <p>{t('common:loading')}</p>
      <button>{t('auth:loginButton')}</button>
    </div>
  );
};
```

### Accessing i18n Instance

```tsx
const MyComponent = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div>
      <p>Current language: {i18n.language}</p>
      <button onClick={() => changeLanguage('de')}>Deutsch</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
};
```

## Adding New Translations

### 1. Add Translation Keys to JSON Files

Add the new key to both English and German files:

**src/i18n/locales/en/common.json:**
```json
{
  "newKey": "New translation text",
  ...
}
```

**src/i18n/locales/de/common.json:**
```json
{
  "newKey": "Neuer Übersetzungstext",
  ...
}
```

### 2. Update TypeScript Types (Optional)

If you're using TypeScript strict mode, update the type definitions in `src/react-i18next.d.ts`:

```typescript
declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      common: {
        newKey: string;
        ...
      };
    };
  }
}
```

### 3. Use in Component

```tsx
const MyComponent = () => {
  const { t } = useTranslation();
  return <p>{t('common:newKey')}</p>;
};
```

## Adding a New Language

### 1. Create Language Directory

```bash
mkdir src/i18n/locales/fr
```

### 2. Create Translation Files

Copy the structure from English:

```bash
cp src/i18n/locales/en/*.json src/i18n/locales/fr/
```

### 3. Translate Content

Edit each JSON file with French translations.

### 4. Update Configuration

Add the new language to `src/i18n/config.ts`:

```typescript
import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frUsers from './locales/fr/users.json';
import frSimcards from './locales/fr/simcards.json';

i18n.init({
  resources: {
    en: { ... },
    de: { ... },
    fr: {
      common: frCommon,
      auth: frAuth,
      users: frUsers,
      simcards: frSimcards,
    },
  },
  ...
});
```

### 5. Add Language Switcher Option

Update the Header component to include the new language:

```tsx
<Dropdown.Item onClick={() => changeLanguage('fr')}>Français</Dropdown.Item>
```

## Best Practices

1. **Use Namespace Prefixes**: Always use the format `namespace:key` (e.g., `common:save`)
2. **Keep Keys Descriptive**: Use clear, descriptive keys (e.g., `loginButton` not `btn1`)
3. **Organize by Module**: Keep related translations in the same module
4. **Avoid Hardcoded Text**: Never hardcode user-facing text in components
5. **Test All Languages**: Always test changes in all supported languages
6. **Use Interpolation**: For dynamic content, use i18next interpolation:

```json
{
  "greeting": "Hello {{name}}"
}
```

```tsx
<p>{t('common:greeting', { name: 'John' })}</p>
```

## Language Detection

The application automatically detects the user's preferred language using the following order:

1. **localStorage** - Previously selected language
2. **Browser settings** - User's browser language preference

The selected language is persisted in localStorage for future visits.

## Fallback Language

If a translation key is missing in the current language, the application falls back to English (en).

## References

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
