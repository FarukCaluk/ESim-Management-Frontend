import React from 'react';
import { SimCardsTable } from '../components/SimCards/SimCardsTable';
import { UserTable } from '../components/Users/user-table';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <h1>SimCards</h1>
      <SimCardsTable />
      <h1>Users</h1>
      <UserTable />
    </div>
  );
}

export default App;
