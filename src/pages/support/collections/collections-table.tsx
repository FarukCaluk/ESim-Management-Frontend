import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../../hooks/use-api';
import { getCollections } from '../../../api/models/collection-modul';
import { Collection } from '../../../types/collection.types';

export const CollectionsTable: React.FC = () => {
  const { data: collections, loading, error } = useAPI<Collection[]>(getCollections);
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc'); // NEW

  const filtered = useMemo(() => {
    if (!collections) return [];
    const q = query.trim().toLowerCase();
    let list = !q
      ? collections
      : collections.filter((c) => {
          const hay = [
            c._id,
            c.name,
            c.country,
            c.createdBy,
            c.assignedAgency,
            c.expirationDate ? new Date(c.expirationDate).toLocaleDateString() : '',
            String(c.plans?.length ?? 0),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          return hay.includes(q);
        });

    const cmp = (a: Collection, b: Collection) =>
      (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
    return list.slice().sort((a, b) => (sortDir === 'asc' ? cmp(a, b) : cmp(b, a)));
  }, [collections, query, sortDir]);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied((v) => (v === value ? null : v)), 1200);
    } catch {
      /* no-op */
    }
  };

  if (loading) {
    return <div className="h-32 animate-pulse rounded-xl border border-border bg-card" />;
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        {t('errorLoadingCollections') || 'Error loading collections'}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold text-foreground">
            {t('Collections') || 'Collections'}
          </h2>
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
        <table className="min-w-[1000px] w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <tr className="border-y border-border text-foreground/80">
              <th className="px-4 py-2 text-left text-[13px] font-medium whitespace-nowrap">
                {t('collections.table.id')}
              </th>
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
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-foreground/60" colSpan={7}>
                  {t('noResults') || 'No results'}
                </td>
              </tr>
            ) : (
              filtered.map((col) => (
                <tr
                  key={col._id}
                  className="border-t border-border odd:bg-card even:bg-muted/20 hover:bg-accent/40"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="inline-block max-w-[220px] truncate" title={col._id}>
                        {col._id}
                      </span>
                      {col._id && (
                        <button
                          type="button"
                          onClick={() => copy(col._id!)}
                          className="inline-flex h-6 items-center rounded border border-border px-2 text-xs text-foreground/70 hover:bg-accent"
                          title="Copy ID"
                        >
                          {copied === col._id ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </td>
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
                  <td className="px-4 py-3 whitespace-nowrap">{col.plans?.length ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionsTable;
