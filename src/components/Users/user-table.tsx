import React from 'react';
import { Table, Image } from 'react-bootstrap';
import { useAPI } from '../../api/hooks/use-api';
import { getUsers } from '../../api/models/user-model';
import { User } from '../../types/type-user';
import { Link, useNavigate } from 'react-router-dom';

export const UserTable: React.FC = () => {
  const { data: users, loading, error } = useAPI<User[]>(getUsers);
  const navigate = useNavigate();

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users {error.message}</p>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Avatar</th>
          <th>Name</th>
          <th>Email</th>
          <th>Verified</th>
          <th>Language</th>
          <th>Currency</th>
          <th>Type</th>
          <th>Credits</th>
          <th>Total Orders</th>
          <th>Phone</th>
          <th>Last Gift Order</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr
            key={user._id}
            style={{ cursor: 'pointer' }}
            onDoubleClick={() => navigate(`/users/${user._id}`)}
          >
            <td>{user._id}</td>
            <td>
              {user.profile?.avatarUrl ? (
                <Image src={user.profile.avatarUrl} roundedCircle width={40} height={40} />
              ) : (
                'N/A'
              )}
            </td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.verified ? 'Yes' : 'No'}</td>
            <td>{user.language}</td>
            <td>{user.currency}</td>
            <td>{user.type}</td>
            <td>{user.credits}</td>
            <td>{user.totalOrders}</td>
            <td>{user.profile?.phoneNumber || 'N/A'}</td>
            <td>{user.lastGiftAtOrder || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
