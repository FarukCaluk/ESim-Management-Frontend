import api from '../utils/api-client';

export type ActivityItem = {
  type: string;
  action: string;
  entityId?: string | number;
  timestamp: string;
};

export type OverviewStats = {
  users: number;
  plans: number;
  collections: number;
  simcards: number;
  recent: ActivityItem[];
};

export async function getOverviewStats(): Promise<OverviewStats> {
  const res = await api.get<Partial<OverviewStats>>('/dashboard/overview');
  const data = res.data ?? {};
  return {
    users: data.users ?? 0,
    plans: data.plans ?? 0,
    collections: data.collections ?? 0,
    simcards: data.simcards ?? 0,
    recent: Array.isArray(data.recent) ? data.recent : [],
  };
}
