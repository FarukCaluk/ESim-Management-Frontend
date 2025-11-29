import api from '../../utils/api-client';
import { SimCard } from '../../types/simcard.types';

export const getSimCards = async (search?: string): Promise<SimCard[]> => {
  const params = search ? { search } : undefined;
  const res = await api.get('/simcards', { params });
  return res.data;
};
