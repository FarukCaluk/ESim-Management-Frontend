import React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../../hooks/use-api';
import { getPackages } from '../../../api/models/package-modul';
import { Package } from '../../../types/package.types';

export const PackagesTable: React.FC = () => {
  const { data: packages, loading, error } = useAPI<Package[]>(getPackages);
  const { t } = useTranslation();

  if (loading) return <p>{t('loadingPackages')}</p>;
  if (error) return <p>{t('errorLoadingPackages')}</p>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>{t('packages.table.id')}</th>
          <th>{t('packages.table.name')}</th>
          <th>{t('packages.table.volume')}</th>
          <th>{t('packages.table.days')}</th>
          <th>{t('packages.table.providerPrice')}</th>
        </tr>
      </thead>
      <tbody>
        {packages?.map((pkg: Package) => (
          <tr key={pkg._id}>
            <td>{pkg._id}</td>
            <td>{pkg.name}</td>
            <td>{pkg.volume}</td>
            <td>{pkg.days}</td>
            <td>{pkg.providerPrice}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PackagesTable;
