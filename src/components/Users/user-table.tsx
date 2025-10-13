import React from 'react';
import { Table, Image } from 'react-bootstrap';
import { useAPI } from '../../api/hooks/use-api';
import { getUsers } from '../../api/models/user-model';
import { User } from '../../types/type-user';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const UserTable: React.FC = () => {
  const { data: users, loading, error } = useAPI<User[]>(getUsers);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (loading) return <p>{t('users:loadingUsers')}</p>;
  if (error) return <p>{t('users:errorLoadingUsers')} {error.message}</p>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>{t('users:table.id')}</th>
          <th>{t('users:table.avatar')}</th>
          <th>{t('users:table.name')}</th>
          <th>{t('users:table.email')}</th>
          <th>{t('users:table.verified')}</th>
          <th>{t('users:table.language')}</th>
          <th>{t('users:table.currency')}</th>
          <th>{t('users:table.type')}</th>
          <th>{t('users:table.credits')}</th>
          <th>{t('users:table.totalOrders')}</th>
          <th>{t('users:table.phone')}</th>
          <th>{t('users:table.lastGiftOrder')}</th>
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
                t('common:notAvailable')
              )}
            </td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.verified ? t('common:yes') : t('common:no')}</td>
            <td>{user.language}</td>
            <td>{user.currency}</td>
            <td>{user.type}</td>
            <td>{user.credits}</td>
            <td>{user.totalOrders}</td>
            <td>{user.profile?.phoneNumber || t('common:notAvailable')}</td>
            <td>{user.lastGiftAtOrder || t('common:notAvailable')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
