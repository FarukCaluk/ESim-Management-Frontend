import api from '../../utils/api-client';
import { Package } from '../../types/package.types';

export const getPackages = async (): Promise<Package[]> => {
  const res = await api.get('/packages');
  return res.data;
};
