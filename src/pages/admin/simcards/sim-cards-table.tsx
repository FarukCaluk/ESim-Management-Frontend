import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { copyToClipboard } from '../../../utils/clipboard';

import { useAPI } from '../../../hooks/use-api';
import { getSimCards } from '../../../api/models/simcard.models';
import { SimCard } from '../../../types/simcard.types';

export const SimCardsTable: React.FC = () => {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().slice(0, 64);
  const fetchSimCards = useCallback(
    () => getSimCards(normalizedQuery || undefined),
    [normalizedQuery]
  );
  const { data: simCards, loading, error } = useAPI<SimCard[]>(fetchSimCards, [normalizedQuery]);
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);

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

  const Cell = ({
    children,
    title,
    className = '',
    nowrap = false,
  }: {
    children: React.ReactNode;
    title?: string;
    className?: string;
    nowrap?: boolean;
  }) => (
    <td
      className={`px-4 py-3 align-top ${nowrap ? 'whitespace-nowrap' : ''} ${className}`}
      title={title}
    >
      {children}
    </td>
  );

  const Head = ({
    children,
    className = '',
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <th className={`px-4 py-2 text-left text-[13px] font-medium text-foreground/80 ${className}`}>
      {children}
    </th>
  );

  const handleCopy = async (value: string) => {
    if (!value) return;
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(value);
      setTimeout(() => setCopied((curr) => (curr === value ? null : curr)), 1200);
    }
  };

  const normalizedQueryLower = normalizedQuery.toLowerCase();
  const filteredSimCards = useMemo(() => {
    if (!simCards) return [];
    if (!normalizedQueryLower) return simCards;
    return simCards.filter((s) => s.iccid?.toLowerCase().includes(normalizedQueryLower));
  }, [simCards, normalizedQueryLower]);

  const isInitialLoad = loading && !simCards;

  if (isInitialLoad) {
    return <div className="h-32 animate-pulse rounded-xl border border-border bg-card" />;
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        {t('errorLoadingSimCards')}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold text-foreground">{t('Simcards') || 'Simcards'}</h2>
          <span className="text-xs text-foreground/60">({filteredSimCards.length})</span>
        </div>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={64}
            placeholder={t('Search') || 'Search...'}
            className="h-9 w-56 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/50">
              {t('loading') || 'Loading…'}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-[1000px] w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <tr className="border-y border-border">
              <Head className="whitespace-nowrap">{t('simcards.table.iccid')}</Head>
              <Head className="whitespace-nowrap">{t('simcards.table.userId')}</Head>
              <Head className="whitespace-nowrap">{t('simcards.table.providerId')}</Head>
              <Head className="whitespace-nowrap">{t('simcards.table.orderId')}</Head>
              <Head className="whitespace-nowrap">{t('simcards.table.comment')}</Head>
              <Head className="whitespace-nowrap">{t('simcards.table.reserved')}</Head>
              <Head className="whitespace-nowrap">{t('simcards.table.expiration')}</Head>
            </tr>
          </thead>
          <tbody>
            {filteredSimCards.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-foreground/60" colSpan={8}>
                  {t('noResults') || 'No results'}
                </td>
              </tr>
            ) : (
              filteredSimCards.map((sim: SimCard, idx: number) => (
                <tr
                  key={sim._id ?? idx}
                  className="border-t border-border odd:bg-card even:bg-muted/20 hover:bg-accent/40"
                >
                  <Cell nowrap title={sim.iccid}>
                    <div className="flex items-center gap-2">
                      <span className="max-w-[220px] truncate inline-block">{sim.iccid}</span>
                      {sim.iccid && (
                        <button
                          type="button"
                          onClick={() => handleCopy(sim.iccid!)}
                          className="inline-flex h-6 items-center rounded border border-border px-2 text-xs text-foreground/70 hover:bg-accent"
                        >
                          {copied === sim.iccid ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </Cell>
                  <Cell nowrap title={sim.userId || undefined}>
                    <span className="max-w-[200px] truncate inline-block">{sim.userId || '-'}</span>
                  </Cell>
                  <Cell nowrap title={sim.providerId || undefined}>
                    <span className="max-w-[220px] truncate inline-block">
                      {sim.providerId || '-'}
                    </span>
                  </Cell>
                  <Cell nowrap title={sim.orderId || undefined}>
                    <span className="max-w-[220px] truncate inline-block">
                      {sim.orderId || '-'}
                    </span>
                  </Cell>
                  <Cell title={sim.comment || undefined}>
                    <span className="block max-w-[320px] truncate">{sim.comment || '-'}</span>
                  </Cell>
                  <Cell nowrap>
                    <Badge on={!!sim.reserved} />
                  </Cell>
                  <Cell nowrap>
                    {sim.expirationDate ? new Date(sim.expirationDate).toLocaleDateString() : '-'}
                  </Cell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimCardsTable;
