import React, { useEffect, useState } from 'react';
import { getOverviewStats, OverviewStats } from '../../../api/stats';

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
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getOverviewStats();
        if (alive) setStats(data);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? 'Failed to load stats');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>

      {err && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-card" />
          ))
        ) : (
          <>
            <StatCard label="Total Users" value={stats?.users ?? 0} />
            <StatCard label="Total Plans" value={stats?.plans ?? 0} />
            <StatCard label="Total Collections" value={stats?.collections ?? 0} />
            <StatCard
              label="Total Revenue"
              value={stats?.revenue != null ? `$${stats?.revenue.toLocaleString()}` : '—'}
            />
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
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="h-4 w-48 rounded bg-muted" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-32 rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : (stats?.recent ?? []).length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-foreground/60" colSpan={2}>
                    No recent activity.
                  </td>
                </tr>
              ) : (
                stats!.recent.map((r) => (
                  <tr key={r.id ?? r.date}>
                    <td className="px-4 py-3 border-t border-border">{r.action}</td>
                    <td className="px-4 py-3 border-t border-border">
                      {new Date(r.date).toLocaleDateString()}
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
