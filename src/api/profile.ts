import api from '../utils/api-client';

export interface Profile {
  name: string;
  email: string;
}

export const getProfile = async (): Promise<Profile> => {
  const res = await api.get<Profile>('/profile');
  return res.data;
};

export const updateProfile = async (payload: Partial<Profile>): Promise<Profile> => {
  const res = await api.put<Profile>('/profile', payload);
  return res.data;
};
