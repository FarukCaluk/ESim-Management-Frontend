import { api } from '../common-api';
import { SimCard } from '../../types/type-simcard';

export const getSimCards = async (): Promise<SimCard[]> => {
  const res = await api.get('/simcards');
  return res.data;
};
