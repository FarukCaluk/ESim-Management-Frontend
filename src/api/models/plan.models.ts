import api from '../../utils/api-client';
import { Plan } from '../../types/plan.types';

export const getPlans = async (search?: string): Promise<Plan[]> => {
  const res = await api.get('/plans', {
    params: search ? { search } : undefined,
  });

  const payload = res.data;
  if (Array.isArray(payload?.plans)) return payload.plans;
  if (Array.isArray(payload?.data?.plans)) return payload.data.plans;
  if (Array.isArray(payload)) return payload;
  return [];
};

export async function createPlan(body: {
  name: string;
  collectionId: string;
  country?: string;
  volume?: number;
  days?: number;
  providerPrice?: number;
  esimflyPrice?: number;
  createdBy?: string;
}) {
  if (!body.country || !body.country.trim()) {
    throw new Error('country is required');
  }

  const payload: Record<string, any> = {
    name: body.name.trim(),
    collectionId: String(body.collectionId),
    country: body.country.trim(),
  };

  if (typeof body.volume === 'number' && Number.isFinite(body.volume)) {
    payload.volume = body.volume;
  }
  if (typeof body.days === 'number' && Number.isFinite(body.days)) {
    payload.days = Math.trunc(body.days);
  }
  if (typeof body.providerPrice === 'number' && Number.isFinite(body.providerPrice)) {
    payload.providerPrice = Number(body.providerPrice);
  }
  if (typeof body.esimflyPrice === 'number' && Number.isFinite(body.esimflyPrice)) {
    payload.esimflyPrice = Number(body.esimflyPrice);
  }
  if (body.createdBy) {
    payload.createdBy = String(body.createdBy);
  }

  try {
    const res = await api.post('/plans', payload);
    return res.data?.plan ?? res.data;
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const detail =
      (Array.isArray(data?.errors) && data.errors.map((e: any) => e?.message ?? e).join(', ')) ||
      (Array.isArray(data?.message) && data.message.join(', ')) ||
      data?.message ||
      data?.error ||
      err?.message ||
      'Bad Request';
    console.error('createPlan failed:', { status, payload, response: data });
    throw new Error(detail);
  }
}
