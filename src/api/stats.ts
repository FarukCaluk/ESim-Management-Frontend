type AnyJson = Record<string, any>;

export type ActivityItem = { id?: string | number; action: string; date: string };
export type OverviewStats = {
  users: number;
  plans: number;
  collections: number;
  simcards: number;
  recent: ActivityItem[];
};

const RAW_API =
  ((import.meta as any)?.env?.VITE_API_URL as string | undefined) ??
  ((process.env as any)?.REACT_APP_API_URL as string | undefined) ??
  'http://localhost:3000/api';
const API = RAW_API.replace(/\/$/, '');

const PATHS = {
  users: '/users',
  plans: '/plans',
  collections: '/collections',
  simcards: '/simcards',
} as const;

function token() {
  return sessionStorage.getItem('token') || localStorage.getItem('token') || '';
}
function auth(h?: HeadersInit): HeadersInit {
  const t = token();
  return {
    Accept: 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...(h || {}),
  };
}

async function parseCount(res: Response): Promise<number | null> {
  const headerCount = res.headers.get('x-total-count');
  if (headerCount && !Number.isNaN(Number(headerCount))) return Number(headerCount);

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return null;
  const d: any = await res.json();

  if (typeof d === 'number') return d;
  if (typeof d?.count === 'number') return d.count;
  if (typeof d?.total === 'number') return d.total;
  if (typeof d?.totalCount === 'number') return d.totalCount;
  if (typeof d?.meta?.total === 'number') return d.meta.total;
  if (typeof d?.pagination?.total === 'number') return d.pagination.total;

  if (Array.isArray(d)) return d.length;
  if (Array.isArray(d?.items)) return d.items.length;
  if (Array.isArray(d?.data)) return d.data.length;

  return null;
}

async function fetchCount(path: string): Promise<number> {
  const urls = [`${API}${path}`, `${API}${path}?limit=1`];
  for (const url of urls) {
    try {
      const res = await fetch(url, { credentials: 'include', headers: auth() });
      if (!res.ok) continue;
      const n = await parseCount(res);
      if (n != null) return n;
    } catch {}
  }
  return 0;
}

/* Generic list fetcher (tries with/without limit) */
async function fetchList(path: string, limit = 5): Promise<any[]> {
  const urls = [`${API}${path}?limit=${limit}`, `${API}${path}`];
  for (const url of urls) {
    try {
      const res = await fetch(url, { credentials: 'include', headers: auth() });
      if (!res.ok) continue;
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) continue;
      const d: any = await res.json();
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.items)) return d.items;
      if (Array.isArray(d?.data)) return d.data;
      if (Array.isArray(d?.content)) return d.content;
      if (Array.isArray(d?.results)) return d.results;
    } catch {
      /* try next */
    }
  }
  return [];
}

function getCreatedAt(x: any): string | undefined {
  const v = x?.createdAt ?? x?.created_at ?? x?.created ?? x?.date ?? x?.timestamp;
  const iso = v ? new Date(v).toISOString() : undefined;
  return iso && !Number.isNaN(Date.parse(iso)) ? iso : undefined;
}

function toActivity(
  items: any[],
  kind: 'user' | 'plan' | 'collection' | 'simcard'
): ActivityItem[] {
  const label =
    kind === 'user'
      ? 'User added'
      : kind === 'plan'
        ? 'Plan added'
        : kind === 'collection'
          ? 'Collection added'
          : 'Simcard added';
  return items
    .map((x, idx) => {
      const date = getCreatedAt(x) ?? new Date(0).toISOString();
      const name = x?.name ?? x?.email ?? x?.iccid ?? x?._id;
      return {
        id: x?._id ?? `${kind}-${idx}-${name ?? ''}`,
        action: `${label}${name ? `: ${name}` : ''}`,
        date,
      } as ActivityItem;
    })
    .filter(Boolean);
}

// Choose which 5 to show: 'youngest' (newest) or 'oldest'
const RECENT_ORDER: 'youngest' | 'oldest' = 'youngest';

async function fetchRecentCombined(limit = 5): Promise<ActivityItem[]> {
  const [u, p, c, s] = await Promise.all([
    fetchList(PATHS.users, limit),
    fetchList(PATHS.plans, limit),
    fetchList(PATHS.collections, limit),
    fetchList(PATHS.simcards, limit),
  ]);

  const all = [
    ...toActivity(u, 'user'),
    ...toActivity(p, 'plan'),
    ...toActivity(c, 'collection'),
    ...toActivity(s, 'simcard'),
  ];

  const byNewestFirst = (a: ActivityItem, b: ActivityItem) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();
  const byOldestFirst = (a: ActivityItem, b: ActivityItem) =>
    new Date(a.date).getTime() - new Date(b.date).getTime();

  return all.sort(RECENT_ORDER === 'youngest' ? byNewestFirst : byOldestFirst).slice(0, limit);
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const [users, plans, collections, simcards, recent] = await Promise.all([
    fetchCount(PATHS.users),
    fetchCount(PATHS.plans),
    fetchCount(PATHS.collections),
    fetchCount(PATHS.simcards),
    fetchRecentCombined(5),
  ]);

  return { users, plans, collections, simcards, recent };
}
