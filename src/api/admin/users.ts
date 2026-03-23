import api from '../../utils/api-client';
import { User, CreateUserPayload } from '../../types/user';

export const listUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>('/admin/users');
  return res.data;
};

export const createUser = async (user: CreateUserPayload): Promise<User> => {
  const res = await api.post<User>('/admin/users', user);
  return res.data;
};

export const editUser = async (id: string, user: CreateUserPayload): Promise<User> => {
  const res = await api.put<User>(`/admin/users/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

export const blockUser = async (id: string): Promise<void> => {
  await api.post(`/admin/users/${id}/block`);
};
