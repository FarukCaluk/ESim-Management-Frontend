import { useEffect, useState } from 'react';
import { getOverviewStats, OverviewStats } from '../../../api/stats';
import Spinner from '../../../components/ui/spinner';
import ErrorAlert from '../../../components/ui/error-alert';
import type { ActivityItem } from '../../../api/stats';

const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
    <div className="text-sm text-foreground/70">{label}</div>
    <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getOverviewStats();
        setStats(data);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>

      {err && <ErrorAlert message={err} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Spinner key={i} />)
        ) : (
          <>
            <StatCard label="Total Users" value={stats?.users ?? 0} />
            <StatCard label="Total Plans" value={stats?.plans ?? 0} />
            <StatCard label="Total Collections" value={stats?.collections ?? 0} />
            <StatCard label="Total Simcards" value={stats?.simcards ?? 0} />
          </>
        )}
      </div>

      <div>
        <div className="mb-3 text-lg font-semibold text-foreground">Recent Activity</div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-muted/40 text-foreground/80">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Activity</th>
                <th className="px-4 py-2 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={`recent-skeleton-${i}`}>
                    <td className="px-4 py-3">
                      <Spinner className="h-4 w-48 rounded bg-muted animate-pulse" />
                    </td>
                    <td className="px-4 py-3">
                      <Spinner className="h-4 w-32 rounded bg-muted animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : stats!.recent.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-foreground/60" colSpan={2}>
                    No recent activity
                  </td>
                </tr>
              ) : (
                stats!.recent.map((item: ActivityItem, idx: number) => (
                  <tr key={item.entityId ?? `${item.type}-${idx}-${item.timestamp}`}>
                    <td className="px-4 py-3 border-t border-border">
                      <span className="mr-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs uppercase tracking-wide text-foreground/70">
                        {item.type}
                      </span>
                      {item.action}
                    </td>
                    <td className="px-4 py-3 border-t border-border text-foreground/70">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
