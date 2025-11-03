import api from '../../utils/api-client';
import { User } from '../../types/user.types';

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get('/users');
  return res.data.data;
};
