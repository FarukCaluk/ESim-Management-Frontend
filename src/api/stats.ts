/* Stats API (typed, self-contained) */

const API =
  // Vite
  ((import.meta as any)?.env?.VITE_API_URL as string | undefined) ??
  // CRA
  ((process.env as any)?.REACT_APP_API_URL as string | undefined) ??
  '';

type AnyJson = Record<string, any>;

export type ActivityItem = {
  id?: string | number;
  action: string;
  date: string; // ISO
};

export type OverviewStats = {
  users: number;
  plans: number;
  collections: number;
  revenue?: number;
  recent: ActivityItem[];
};

/* Adjust to match your backend routes */
export const PATHS = {
  users: '/users',
  plans: '/plans',
  collections: '/collections',
  revenue: '/payments/total', // optional
  recentActivity: '/activity/recent', // optional
} as const;

function getToken() {
  return sessionStorage.getItem('token') || localStorage.getItem('token') || '';
}

function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra || {}),
  };
}

async function fetchJson<T = AnyJson>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: authHeaders(init?.headers),
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) return null as unknown as T;
  return (await res.json()) as T;
}

async function fetchCount(resourcePath: string): Promise<number> {
  // Try common endpoints/shapes
  const urls = [
    `${API}${resourcePath}/count`,
    `${API}${resourcePath}?limit=1`,
    `${API}${resourcePath}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { credentials: 'include', headers: authHeaders() });
      if (!res.ok) continue;

      const headerCount = res.headers.get('x-total-count');
      if (headerCount && !Number.isNaN(Number(headerCount))) return Number(headerCount);

      const ct = res.headers.get('content-type') ?? '';
      if (!ct.includes('application/json')) continue;

      const d: any = await res.json();

      if (typeof d === 'number') return d;
      if (typeof d?.count === 'number') return d.count;
      if (typeof d?.total === 'number') return d.total;
      if (typeof d?.totalCount === 'number') return d.totalCount;
      if (typeof d?.meta?.total === 'number') return d.meta.total;
      if (typeof d?.pagination?.total === 'number') return d.pagination.total;

      if (Array.isArray(d)) return d.length;
      if (Array.isArray(d?.data)) return d.data.length;
      if (Array.isArray(d?.items)) return d.items.length;
      if (Array.isArray(d?.content)) return d.content.length;
    } catch {
      // try next
    }
  }
  return 0;
}

async function fetchRevenue(): Promise<number | undefined> {
  try {
    const data = await fetchJson<AnyJson>(`${API}${PATHS.revenue}`);
    if (typeof data?.total === 'number') return data.total;
    if (typeof data?.amount === 'number') return data.amount;
    if (typeof data?.revenue === 'number') return data.revenue;
  } catch {
    /* optional */
  }
  return undefined;
}

async function fetchRecentActivity(limit = 5): Promise<ActivityItem[]> {
  try {
    const data = await fetchJson<any>(`${API}${PATHS.recentActivity}?limit=${limit}`);
    const toItem = (x: any, idx: number): ActivityItem => ({
      id: x?.id ?? idx,
      action: x?.action ?? x?.event ?? x?.message ?? 'Activity',
      date: x?.date ?? x?.createdAt ?? x?.timestamp ?? new Date().toISOString(),
    });
    if (Array.isArray(data)) return data.map(toItem);
    if (Array.isArray(data?.items)) return data.items.map(toItem);
  } catch {
    /* optional */
  }
  return [];
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const [users, plans, collections, revenue, recent] = await Promise.all([
    fetchCount(PATHS.users),
    fetchCount(PATHS.plans),
    fetchCount(PATHS.collections),
    fetchRevenue(),
    fetchRecentActivity(5),
  ]);

  return { users, plans, collections, revenue, recent };
}
