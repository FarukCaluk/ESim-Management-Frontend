import React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../../hooks/use-api';
import { getPlans } from '../../../api/models/plan-modul';
import { Plan } from '../../../types/plan.types';

export const PlansTable: React.FC = () => {
  const { data: plans, loading, error } = useAPI<Plan[]>(getPlans);
  const { t } = useTranslation();

  if (loading) return <p>{t('loadingPlans')}</p>;
  if (error) return <p>{t('errorLoadingPlans')}</p>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>{t('plans.table.id')}</th>
          <th>{t('plans.table.name')}</th>
          <th>{t('plans.table.volume')}</th>
          <th>{t('plans.table.days')}</th>
          <th>{t('plans.table.providerPrice')}</th>
          <th>{t('plans.table.esimflyPrice')}</th>
          <th>{t('plans.table.earnings')}</th>
          <th>{t('plans.table.collectionId')}</th>
          <th>{t('plans.table.country')}</th>
          <th>{t('plans.table.available')}</th>
          <th>{t('plans.table.availableCount')}</th>
        </tr>
      </thead>
      <tbody>
        {plans?.map((plan) => (
          <tr key={plan._id}>
            <td>{plan._id}</td>
            <td>{plan.name}</td>
            <td>{plan.volume}</td>
            <td>{plan.days}</td>
            <td>{plan.providerPrice}</td>
            <td>{plan.esimflyPrice}</td>
            <td>{plan.earnings}</td>
            <td>{plan.collectionId}</td>
            <td>{plan.country}</td>
            <td>{plan.available ? t('yes') : t('no')}</td>
            <td>{plan.availableCount}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
