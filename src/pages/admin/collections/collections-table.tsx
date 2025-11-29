import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../../hooks/use-api';
import { getCollections, createCollection } from '../../../api/models/collection.models';
import { getProfile } from '../../../api/profile';
import { Collection } from '../../../types/collection.types';
import { getPlans } from '../../../api/models/plan.models';
import { Plan } from '../../../types/plan.types';
import { resolveUserId } from '../../../utils/resolve-user-id';
import Spinner from '../../../components/ui/spinner';
import ErrorAlert from '../../../components/ui/error-alert';

export const CollectionsTable: React.FC = () => {
  const { data: plans } = useAPI<Plan[]>(getPlans);
  const { data: profile } = useAPI(getProfile);
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().slice(0, 64);
  const normalizedLower = normalizedQuery.toLowerCase();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCollections = useCallback(
    () => getCollections(normalizedQuery || undefined),
    [normalizedQuery, refreshKey]
  );
  const {
    data: collections,
    loading,
    error,
  } = useAPI<Collection[]>(fetchCollections, [normalizedQuery, refreshKey]);

  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    country: '',
    expirationDate: '', // yyyy-mm-dd
  });
  const [createdBy, setCreatedBy] = useState<string>('');

  useEffect(() => {
    setCreatedBy(resolveUserId(profile as Record<string, any> | undefined));
  }, [profile]);

  const countsByCollectionId = React.useMemo(() => {
    const map = new Map<string, number>();
    (plans || []).forEach((p) => {
      const colId =
        (p as any).collectionId || (p as any).collection_id || (p as any).collection?.id;
      if (colId) map.set(colId, (map.get(colId) || 0) + 1);
    });
    return map;
  }, [plans]);

  const sorted = useMemo(() => {
    const base = !collections
      ? []
      : !normalizedLower
        ? collections
        : collections.filter((col) => col.name?.toLowerCase().includes(normalizedLower));

    const cmp = (a: Collection, b: Collection) =>
      (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
    return base.slice().sort((a, b) => (sortDir === 'asc' ? cmp(a, b) : cmp(b, a)));
  }, [collections, normalizedLower, sortDir]);

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateErr(null);

    if (!form.name.trim() || !form.country.trim()) {
      setCreateErr('Name and Country are required');
      return;
    }
    if (!createdBy) {
      setCreateErr('Unable to resolve createdBy. Please re-login and try again.');
      return;
    }

    const isoDate =
      form.expirationDate && !Number.isNaN(Date.parse(form.expirationDate))
        ? new Date(form.expirationDate).toISOString()
        : undefined;

    setCreating(true);
    try {
      await createCollection({
        name: form.name.trim(),
        country: form.country.trim(),
        createdBy,
        ...(isoDate ? { expirationDate: isoDate } : {}),
      });

      setRefreshKey((k) => k + 1);

      setShowCreate(false);
      setForm({ name: '', country: '', expirationDate: '' });
    } catch (err: any) {
      setCreateErr(err.message || 'Failed to create collection');
    } finally {
      setCreating(false);
    }
  };

  if (loading && !collections) {
    return <Spinner className="h-32 w-full rounded-xl border border-border bg-card" />;
  }

  if (error) {
    return <ErrorAlert message={t('errorLoadingCollections') || 'Error loading collections'} />;
  }

  const pending = loading && !!collections;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold text-foreground">
            {t('Collections') || 'Collections'}
          </h2>
          <span className="text-xs text-foreground/60">({sorted.length})</span>
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
        <table className="min-w-[1000px] w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <tr className="border-y border-border text-foreground/80">
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('collections.table.name')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('collections.table.country')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('collections.table.expirationDate')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('collections.table.createdBy')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('collections.table.assignedAgency')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('collections.table.plans')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-foreground/60" colSpan={6}>
                  {t('noResults') || 'No results'}
                </td>
              </tr>
            ) : (
              sorted.map((col) => (
                <tr
                  key={col._id}
                  className="border-t border-border odd:bg-card even:bg-muted/20 hover:bg-accent/40"
                >
                  <td className="px-4 py-3">
                    <span className="block max-w-[260px] truncate" title={col.name}>
                      {col.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{col.country}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {col.expirationDate ? new Date(col.expirationDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="block max-w-[240px] truncate"
                      title={String(col.createdBy || '')}
                    >
                      {col.createdBy || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="block max-w-[240px] truncate"
                      title={String(col.assignedAgency || '')}
                    >
                      {col.assignedAgency || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {countsByCollectionId.get(col._id as any) ??
                      (col as any).plansCount ??
                      col.plans?.length ??
                      0}
                  </td>
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
            <h3 className="mb-4 text-lg font-semibold">Add Collection</h3>
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
                <div>
                  <label className="mb-1 block text-xs font-medium">Country *</label>
                  <input
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Expiration Date</label>
                  <input
                    type="date"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
                    value={form.expirationDate}
                    onChange={(e) => setForm((f) => ({ ...f, expirationDate: e.target.value }))}
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

export default CollectionsTable;
