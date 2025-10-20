import api from '../utils/api-client';

export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  role: string;
}

export const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const register = async (data: any) => {
  const res = await fetch(`${process.env.API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${process.env.API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await fetch(`${process.env.API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  return res.json();
};
