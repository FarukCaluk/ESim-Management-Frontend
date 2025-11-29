import api from '../../utils/api-client';
import { Collection } from '../../types/collection.types';

export const getCollections = async (search?: string): Promise<Collection[]> => {
  const res = await api.get('/collections', {
    params: search ? { search } : undefined,
  });

  const payload = res.data;
  if (Array.isArray(payload?.collections)) return payload.collections;
  if (Array.isArray(payload?.data?.collections)) return payload.data.collections;
  if (Array.isArray(payload)) return payload;
  return [];
};

export async function createCollection(body: {
  name: string;
  country: string;
  createdBy: string; // REQUIRED
  expirationDate?: string; // optional ISO
}) {
  const api =
    ((import.meta as any)?.env?.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api';
  const base = api.replace(/\/$/, '');
  const token = localStorage.getItem('token') || '';

  const url = `${base}/collections`;
  const payload: any = {
    name: body.name.trim(),
    country: body.country.trim(),
    createdBy: String(body.createdBy), // ensure string
  };
  if (body.expirationDate) payload.expirationDate = body.expirationDate;

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => '');
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const msg = data?.message || data?.error || text || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data?.collection ?? data;
}
