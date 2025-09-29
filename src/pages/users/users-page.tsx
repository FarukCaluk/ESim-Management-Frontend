import React from 'react';
import { UserTable } from '../../components/Users/user-table';

export const UsersPage: React.FC = () => {
  return (
    <div className="container mt-4">
      <h2>Users</h2>
      <UserTable />
    </div>
  );
};
