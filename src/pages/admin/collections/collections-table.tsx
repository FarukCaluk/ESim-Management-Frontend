import React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../../hooks/use-api';
import { getCollections } from '../../../api/models/collection-modul';
import { Collection } from '../../../types/collection.types';

export const CollectionsTable: React.FC = () => {
  const { data: collections, loading, error } = useAPI<Collection[]>(getCollections);
  const { t } = useTranslation();

  if (loading) return <p>{t('loadingCollections')}</p>;
  if (error) return <p>{t('errorLoadingCollections')}</p>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>{t('collections.table.id')}</th>
          <th>{t('collections.table.name')}</th>
          <th>{t('collections.table.country')}</th>
          <th>{t('collections.table.expirationDate')}</th>
          <th>{t('collections.table.createdBy')}</th>
          <th>{t('collections.table.assignedAgency')}</th>
          <th>{t('collections.table.plans')}</th>
        </tr>
      </thead>
      <tbody>
        {collections?.map((col) => (
          <tr key={col._id}>
            <td>{col._id}</td>
            <td>{col.name}</td>
            <td>{col.country}</td>
            <td>{col.expirationDate ? new Date(col.expirationDate).toLocaleDateString() : ''}</td>
            <td>{col.createdBy}</td>
            <td>{col.assignedAgency}</td>
            <td>{col.plans?.length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
