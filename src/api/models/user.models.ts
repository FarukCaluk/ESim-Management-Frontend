import api from '../../utils/api-client';
import { User } from '../../types/user.types';

export const getUsers = async (search?: string): Promise<User[]> => {
  const res = await api.get('/users', {
    params: search ? { search } : undefined,
  });
  return res.data?.data ?? res.data?.users ?? res.data ?? [];
};

export async function createUser(body: { name: string; email: string; password: string }) {
  const res = await api.post('/users', body);
  return res.data;
}
