import api from '../../utils/api-client';
import { SimCard } from '../../types/simcard.types';

export const getSimCards = async (): Promise<SimCard[]> => {
  const res = await api.get('/simcards');
  return res.data;
};
