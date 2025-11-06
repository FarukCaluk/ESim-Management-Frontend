import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../../hooks/use-api';
import { getPlans } from '../../../api/models/plan-modul';
import { Plan } from '../../../types/plan.types';

export const PlansTable: React.FC = () => {
  const { data: plans, loading, error } = useAPI<Plan[]>(getPlans);
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc'); // NEW

  const money = (v: unknown) => {
    if (typeof v === 'number')
      return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const num = Number(v as any);
    return Number.isFinite(num)
      ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : (v as any);
  };

  const filtered = useMemo(() => {
    if (!plans) return [];
    const q = query.trim().toLowerCase();
    let list = !q
      ? plans
      : plans.filter((p) =>
          [
            p._id,
            p.name,
            p.volume,
            p.days,
            p.country,
            p.collectionId,
            p.providerPrice,
            p.esimflyPrice,
            p.earnings,
            p.availableCount,
          ]
            .filter((v) => v !== undefined && v !== null)
            .join(' ')
            .toLowerCase()
            .includes(q)
        );

    const cmp = (a: Plan, b: Plan) =>
      (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
    return list.slice().sort((a, b) => (sortDir === 'asc' ? cmp(a, b) : cmp(b, a)));
  }, [plans, query, sortDir]);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied((v) => (v === value ? null : v)), 1200);
    } catch {
      /* no-op */
    }
  };

  const Badge = ({ on }: { on: boolean }) => (
    <span
      className={
        on
          ? 'inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'
          : 'inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700'
      }
    >
      {on ? t('yes') : t('no')}
    </span>
  );

  if (loading)
    return <div className="h-32 animate-pulse rounded-xl border border-border bg-card" />;
  if (error)
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        {t('errorLoadingPlans') || 'Error loading plans'}
      </div>
    );

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold text-foreground">{t('Plans') || 'Plans'}</h2>
          <span className="text-xs text-foreground/60">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('Search') || 'Search...'}
            className="h-9 w-56 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground hover:bg-accent"
            title="Sort by name"
          >
            {sortDir === 'asc' ? 'A–Z' : 'Z–A'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-[1100px] w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <tr className="border-y border-border text-foreground/80">
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.id')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.name')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.volume')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.days')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.providerPrice')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.esimflyPrice')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.earnings')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.collectionId')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.country')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.available')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.availableCount')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-foreground/60" colSpan={11}>
                  {t('noResults') || 'No results'}
                </td>
              </tr>
            ) : (
              filtered.map((plan) => (
                <tr
                  key={plan._id}
                  className="border-t border-border odd:bg-card even:bg-muted/20 hover:bg-accent/40"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="inline-block max-w-[220px] truncate" title={plan._id}>
                        {plan._id}
                      </span>
                      {plan._id && (
                        <button
                          type="button"
                          onClick={() => copy(plan._id!)}
                          className="inline-flex h-6 items-center rounded border border-border px-2 text-xs text-foreground/70 hover:bg-accent"
                          title="Copy ID"
                        >
                          {copied === plan._id ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block max-w-[240px] truncate" title={plan.name}>
                      {plan.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{plan.volume}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{plan.days}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{money(plan.providerPrice)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{money(plan.esimflyPrice)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{money(plan.earnings)}</td>
                  <td className="px-4 py-3">
                    <span
                      className="block max-w-[240px] truncate"
                      title={String(plan.collectionId || '')}
                    >
                      {plan.collectionId || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{plan.country}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge on={!!plan.available} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{plan.availableCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlansTable;
