import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAPI } from '../../../hooks/use-api';
import { getPackages, createPackage } from '../../../api/models/package.models';
import { Package } from '../../../types/package.types';
import Spinner from '../../../components/ui/spinner';
import ErrorAlert from '../../../components/ui/error-alert';

export const PackagesTable: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().slice(0, 64);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [refreshToken, setRefreshToken] = useState(0);

  const fetchPackages = useCallback(
    () => getPackages(normalizedQuery || undefined),
    [normalizedQuery, refreshToken]
  );
  const {
    data: packages,
    loading,
    error,
  } = useAPI<Package[]>(fetchPackages, [normalizedQuery, refreshToken]);

  const normalizedLower = normalizedQuery.toLowerCase();
  const sorted = useMemo(() => {
    const base = !packages
      ? []
      : !normalizedLower
        ? packages
        : packages.filter((pkg) => pkg.name?.toLowerCase().includes(normalizedLower));
    const cmp = (a: Package, b: Package) =>
      (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
    return base.slice().sort((a, b) => (sortDir === 'asc' ? cmp(a, b) : cmp(b, a)));
  }, [packages, normalizedLower, sortDir]);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    volume: '',
    days: '',
    providerPrice: '',
  });

  const moneyFormatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const money = (value: unknown) => {
    const num = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(num) ? moneyFormatter.format(num) : String(value ?? '');
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateErr(null);

    const daysNum = Math.trunc(Number(form.days));
    const priceNum = Number(form.providerPrice);

    if (
      !form.name.trim() ||
      !form.volume.trim() ||
      !Number.isFinite(daysNum) ||
      !Number.isFinite(priceNum)
    ) {
      setCreateErr('Name, volume, days (number) and provider price (number) are required');
      return;
    }

    setCreating(true);
    try {
      await createPackage({
        name: form.name.trim(),
        volume: form.volume.trim(),
        days: daysNum,
        providerPrice: priceNum,
      });

      setRefreshToken((x) => x + 1);
      setShowCreate(false);
      setForm({ name: '', volume: '', days: '', providerPrice: '' });
    } catch (err: any) {
      setCreateErr(
        err.message || 'Failed to create package. Try a unique name and format like volume "10GB".'
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading && !packages) {
    return <Spinner className="h-32 w-full rounded-xl border border-border bg-card" />;
  }

  if (error) {
    return <ErrorAlert message={t('errorLoadingPackages') || 'Error loading packages'} />;
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold text-foreground">{t('Packages') || 'Packages'}</h2>
          <span className="text-xs text-foreground/60">({sorted.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={64}
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
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-white hover:bg-primary/90"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-[700px] w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <tr className="border-y border-border text-foreground/80">
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('packages.table.name')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('packages.table.volume')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('packages.table.days')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('packages.table.providerPrice')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-foreground/60" colSpan={4}>
                  {t('noResults') || 'No results'}
                </td>
              </tr>
            ) : (
              sorted.map((pkg) => (
                <tr
                  key={pkg._id}
                  className="border-t border-border odd:bg-card even:bg-muted/20 hover:bg-accent/40"
                >
                  <td className="px-4 py-3">
                    <span className="block max-w-[240px] truncate" title={pkg.name}>
                      {pkg.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{pkg.volume}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{pkg.days}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{money(pkg.providerPrice)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-3">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">Create Package</h3>
            {createErr && (
              <p className="mb-3 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {createErr}
              </p>
            )}
            <form className="space-y-4" onSubmit={submitCreate}>
              <div>
                <label className="block text-xs font-medium text-foreground/70">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/70">Volume</label>
                <input
                  value={form.volume}
                  onChange={(e) => setForm((f) => ({ ...f, volume: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. 10GB"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground/70">Days</label>
                  <input
                    type="number"
                    min={1}
                    value={form.days}
                    onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/70">
                    Provider Price
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.providerPrice}
                    onChange={(e) => setForm((f) => ({ ...f, providerPrice: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="h-9 rounded-md border border-border px-4 text-sm text-foreground hover:bg-muted/40"
                  onClick={() => {
                    setShowCreate(false);
                    setForm({ name: '', volume: '', days: '', providerPrice: '' });
                    setCreateErr(null);
                  }}
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

export default PackagesTable;
