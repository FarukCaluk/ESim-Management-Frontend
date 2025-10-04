import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useAPI } from '../../hooks/use-api';
import { getSimCards } from '../../api/models/simcard-modul';
import { SimCard } from '../../types/simcard.types';

export const SimCardsTable: React.FC = () => {
  const { data: simCards, loading, error } = useAPI<SimCard[]>(getSimCards);
  const { t } = useTranslation();

  if (loading) return <p>{t('loadingSimCards')}</p>;
  if (error) return <p>{t('errorLoadingSimCards')}</p>;

  const getReservedBadge = (reserved: boolean) => (
    <Badge bg={reserved ? 'success' : 'secondary'}>
      {reserved ? t('table.yes') : t('table.no')}
    </Badge>
  );

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>{t('table.simcardId')}</th>
          <th>{t('table.iccid')}</th>
          <th>{t('table.userId')}</th>
          <th>{t('table.providerId')}</th>
          <th>{t('table.orderId')}</th>
          <th>{t('table.comment')}</th>
          <th>{t('table.reserved')}</th>
          <th>{t('table.expiration')}</th>
        </tr>
      </thead>
      <tbody>
        {simCards?.map((sim: SimCard) => (
          <tr key={sim._id}>
            <td>{sim._id}</td>
            <td>{sim.iccid}</td>
            <td>{sim.userId || '-'}</td>
            <td>{sim.providerId || '-'}</td>
            <td>{sim.orderId || '-'}</td>
            <td>{sim.comment || '-'}</td>
            <td>{getReservedBadge(sim.reserved)}</td>
            <td>{sim.expirationDate ? new Date(sim.expirationDate).toLocaleDateString() : '-'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
