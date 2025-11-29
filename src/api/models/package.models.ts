import api from '../../utils/api-client';
import { Package } from '../../types/package.types';

export const getPackages = async (search?: string): Promise<Package[]> => {
  const params = search ? { search } : undefined;
  const res = await api.get('/packages', { params });
  return res.data;
};

export async function createPackage(body: {
  name: string;
  volume: string;
  days: number;
  providerPrice: number;
}) {
  const payload = {
    name: body.name.trim(),
    volume: body.volume.replace(/\s+/g, ''),
    days: Math.trunc(Number(body.days)),
    providerPrice: Number(body.providerPrice),
  };

  const res = await api.post('/packages', payload);
  return res.data?.package ?? res.data;
}
