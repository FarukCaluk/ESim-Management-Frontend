import React from 'react';
import { Table, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAPI } from '../../../hooks/use-api';
import { getUsers } from '../../../api/models/user-modul';
import { User } from '../../../types/user.types';

interface UserTableProps {
  readOnly?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ readOnly = false }) => {
  const { data: users, loading, error } = useAPI<User[]>(getUsers);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users {error.message}</p>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>{t('users.table.id')}</th>
          <th>{t('users.table.avatar')}</th>
          <th>{t('users.table.name')}</th>
          <th>{t('users.table.email')}</th>
          <th>{t('users.table.verified')}</th>
          <th>{t('users.table.language')}</th>
          <th>{t('users.table.currency')}</th>
          <th>{t('users.table.type')}</th>
          <th>{t('users.table.credits')}</th>
          <th>{t('users.table.totalOrders')}</th>
          <th>{t('users.table.phone')}</th>
          <th>{t('users.table.lastGiftOrder')}</th>
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
            <td>{user.verified ? t('yes') : t('no')}</td>
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
