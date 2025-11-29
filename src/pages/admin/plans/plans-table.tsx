import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPI } from '../../../hooks/use-api';
import { getPlans, createPlan } from '../../../api/models/plan.models';
import { getCollections } from '../../../api/models/collection.models';
import { useTranslation } from 'react-i18next';
import { Plan } from '../../../types/plan.types';
import Spinner from '../../../components/ui/spinner';
import ErrorAlert from '../../../components/ui/error-alert';

export const PlansTable: React.FC = () => {
  const { t } = useTranslation();
  const { data: collections } = useAPI<any[]>(getCollections);

  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().slice(0, 64);
  const normalizedLower = normalizedQuery.toLowerCase();
  const [refreshKey, setRefreshKey] = useState(0);
  const [rows, setRows] = useState<Plan[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const fetchPlans = useCallback(
    () => getPlans(normalizedQuery || undefined),
    [normalizedQuery, refreshKey]
  );
  const {
    data: plansData,
    loading,
    error,
  } = useAPI<Plan[]>(fetchPlans, [normalizedQuery, refreshKey]);

  useEffect(() => {
    if (!Array.isArray(plansData)) {
      setRows([]);
      return;
    }
    setRows(
      plansData.map((plan) => {
        const provider = Number(plan.providerPrice);
        const esimfly = Number(plan.esimflyPrice);
        const earnings =
          Number.isFinite(provider) && Number.isFinite(esimfly)
            ? Number((esimfly - provider).toFixed(2))
            : undefined;
        return { ...plan, earnings };
      })
    );
  }, [plansData]);

  useEffect(() => {
    if (!loading) setHasLoadedOnce(true);
  }, [loading]);

  const filteredRows = useMemo(() => {
    const base = normalizedLower
      ? rows.filter((plan) => (plan.name ?? '').toLowerCase().includes(normalizedLower))
      : rows;

    return [...base].sort((a, b) => {
      const cmp = (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, normalizedLower, sortDir]);

  const moneyFormatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const money = (value: unknown) => {
    const num = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(num) ? moneyFormatter.format(num) : String(value ?? '');
  };

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    collectionId: '',
    country: '',
    volume: '', // will parse to number
    days: '', // optional number
    providerPrice: '', // optional number
    esimflyPrice: '', // optional number
  });

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateErr(null);

    if (!form.name.trim()) return setCreateErr('Name is required');
    if (!form.collectionId) return setCreateErr('Collection is required');
    if (!form.country.trim()) return setCreateErr('Country is required');

    const volumeNum = form.volume ? Number(form.volume) : undefined;
    const daysNum = form.days ? Math.trunc(Number(form.days)) : undefined;
    const providerNum = form.providerPrice ? Number(form.providerPrice) : undefined;
    const esimflyNum = form.esimflyPrice ? Number(form.esimflyPrice) : undefined;

    if (form.volume && !Number.isFinite(volumeNum)) return setCreateErr('Volume must be a number');
    if (form.days && !Number.isFinite(daysNum)) return setCreateErr('Days must be a number');
    if (form.providerPrice && !Number.isFinite(providerNum))
      return setCreateErr('Provider price must be a number');
    if (form.esimflyPrice && !Number.isFinite(esimflyNum))
      return setCreateErr('Esimfly price must be a number');

    setCreating(true);
    try {
      await createPlan({
        name: form.name.trim(),
        collectionId: form.collectionId,
        country: form.country.trim(),
        ...(typeof volumeNum === 'number' ? { volume: volumeNum } : {}),
        ...(typeof daysNum === 'number' ? { days: daysNum } : {}),
        ...(typeof providerNum === 'number' ? { providerPrice: providerNum } : {}),
        ...(typeof esimflyNum === 'number' ? { esimflyPrice: esimflyNum } : {}),
      });

      setRefreshKey((k) => k + 1);
      setShowCreate(false);
      setForm({
        name: '',
        collectionId: '',
        country: '',
        volume: '',
        days: '',
        providerPrice: '',
        esimflyPrice: '',
      });
    } catch (err: any) {
      setCreateErr(err.message || 'Failed to create plan');
    } finally {
      setCreating(false);
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

  if (!hasLoadedOnce && loading) {
    return <Spinner className="h-32 w-full rounded-xl border border-border bg-card" />;
  }

  if (error) {
    return <ErrorAlert message={t('errorLoadingPlans') || 'Failed to load plans'} />;
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold text-foreground">Plans</h2>
          <span className="text-xs text-foreground/60">({filteredRows.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-9 w-56 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={() => setSortDir((d: 'asc' | 'desc') => (d === 'asc' ? 'desc' : 'asc'))}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground hover:bg-accent"
            title="Sort by name"
          >
            {sortDir === 'asc' ? 'A–Z' : 'Z–A'}
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-white hover:bg-primary/90"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-[1100px] w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <tr className="border-y border-border text-foreground/80">
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
                eSIMfly price
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('plans.table.earnings')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                Collection
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
            {filteredRows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-foreground/60" colSpan={10}>
                  {t('noResults') || 'No results'}
                </td>
              </tr>
            ) : (
              filteredRows.map((plan: Plan & { earnings?: number }) => (
                <tr
                  key={plan._id}
                  className="border-t border-border odd:bg-card even:bg-muted/20 hover:bg-accent/40"
                >
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
                      title={
                        (collections || []).find(
                          (c: any) => c._id === plan.collectionId || c.id === plan.collectionId
                        )?.name || '-'
                      }
                    >
                      {(collections || []).find(
                        (c: any) => c._id === plan.collectionId || c.id === plan.collectionId
                      )?.name || '-'}
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

      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !creating && setShowCreate(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Add Plan</h3>
            <form onSubmit={submitCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium">Name *</label>
                  <input
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium">Collection *</label>
                  <select
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
                    value={form.collectionId}
                    onChange={(e) => setForm((f) => ({ ...f, collectionId: e.target.value }))}
                    required
                  >
                    <option value="">Select collection…</option>
                    {(collections || []).map((c: any) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium">Country *</label>
                  <input
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Volume (number)</label>
                  <input
                    type="number"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
                    value={form.volume}
                    onChange={(e) => setForm((f) => ({ ...f, volume: e.target.value }))}
                    min={0}
                    step="1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Days (optional)</label>
                  <input
                    type="number"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
                    value={form.days}
                    onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
                    min={1}
                    step="1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Provider Price (number)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
                    value={form.providerPrice}
                    onChange={(e) => setForm((f) => ({ ...f, providerPrice: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Esimfly Price (number)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
                    value={form.esimflyPrice}
                    onChange={(e) => setForm((f) => ({ ...f, esimflyPrice: e.target.value }))}
                  />
                </div>
              </div>

              {createErr && <div className="text-xs text-destructive">{createErr}</div>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !creating && setShowCreate(false)}
                  className="h-9 rounded-md border border-border bg-background px-4 text-sm hover:bg-accent"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                  disabled={creating}
                >
                  {creating ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansTable;
