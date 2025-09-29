# eSIM Management Frontend

This is the **frontend** for the eSIM Management project, built with **React** and **Bootstrap**. It includes:

* **Users table** – displays user data from the backend
* **SIM Cards table** – displays SIM card information
* **Language support** – switch languages from the header
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

### `npm run eject`

⚠️ **Warning:** This is a one-way operation.
It copies all build configuration files into your project, giving full control over webpack, Babel, ESLint, etc. Only use if you need custom build configuration.

---

## Project Structure

```
src/
├─ api/
│  ├─ models/          # API calls per entity (User, SimCard)
├─ components/
│  ├─ Users/           # Users table component
│  ├─ SimCards/        # SIM Cards table component
├─ hooks/
│  ├─ use-api.ts       # Generic useAPI hook
├─ types/              # TypeScript types
├─ App.tsx             # Main app entry
```

---

## Learn More

* [React documentation](https://reactjs.org/)
* [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)

