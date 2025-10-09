import api from '../../utils/api-client';

export const listUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const createUser = async (user: any) => {
  const res = await api.post('/admin/users', user);
  return res.data;
};

export const editUser = async (id: string, user: any) => {
  const res = await api.put(`/admin/users/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const blockUser = async (id: string) => {
  const res = await api.post(`/admin/users/${id}/block`);
  return res.data;
};
