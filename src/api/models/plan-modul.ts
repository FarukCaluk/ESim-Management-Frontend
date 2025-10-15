import api from '../../utils/api-client';
import { Plan } from '../../types/plan.types';

export const getPlans = async (): Promise<Plan[]> => {
  const res = await api.get('/plans');
  return res.data;
};
