import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAPI } from '../../../hooks/use-api';
import { getUsers } from '../../../api/models/user.models';
import { User } from '../../../types/user.types';

interface UserTableProps {
  readOnly?: boolean;
}

const VerifiedBadge: React.FC<{ on: boolean }> = ({ on }) => (
  <span
    className={
      on
        ? 'inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'
        : 'inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700'
    }
  >
    {on ? 'Yes' : 'No'}
  </span>
);

const Avatar: React.FC<{ url?: string; name?: string }> = ({ url, name }) => {
  const initials =
    (name || '')
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return url ? (
    <img
      src={url}
      alt={name || 'avatar'}
      className="h-9 w-9 rounded-full object-cover"
      loading="lazy"
    />
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
      {initials}
    </div>
  );
};

export const UserTable: React.FC<UserTableProps> = ({ readOnly = false }) => {
  const { data: users, loading, error } = useAPI<User[]>(getUsers);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc'); // NEW

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    let list = !q
      ? users
      : users.filter((u) => {
          const hay =
            [u._id, u.name, u.email, u.language, u.currency, u.type, u.profile?.phoneNumber]
              .filter(Boolean)
              .join(' ')
              .toLowerCase() || '';
          return hay.includes(q);
        });

    // sort by name
    const cmp = (a: User, b: User) =>
      (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
    list = list.slice().sort((a, b) => (sortDir === 'asc' ? cmp(a, b) : cmp(b, a)));
    return list;
  }, [users, query, sortDir]);

  if (loading) {
    return <div className="h-32 animate-pulse rounded-xl border border-border bg-card" />;
  }
  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        {t('error') || 'Error'}: {error.message}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold text-foreground">{t('Users') || 'Users'}</h2>
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
              <th className="px-4 py-2 text-left text-[13px] font-medium">{t('users.table.id')}</th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.avatar')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.name')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.email')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.verified')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.language')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.currency')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.type')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.credits')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.totalOrders')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.phone')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-medium">
                {t('users.table.lastGiftOrder')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-foreground/60" colSpan={12}>
                  {t('noResults') || 'No results'}
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-border odd:bg-card even:bg-muted/20 hover:bg-accent/40"
                  style={{ cursor: readOnly ? 'default' : 'pointer' }}
                  onDoubleClick={() => !readOnly && navigate(`/users/${user._id}`)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-block max-w-[220px] truncate" title={user._id}>
                      {user._id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Avatar url={user.profile?.avatarUrl} name={user.name} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="block max-w-[220px] truncate" title={user.name}>
                      {user.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block max-w-[260px] truncate" title={user.email}>
                      {user.email}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <VerifiedBadge on={!!user.verified} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.language}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.currency}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.credits}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.totalOrders}</td>
                  <td className="px-4 py-3">
                    <span
                      className="block max-w-[200px] truncate"
                      title={user.profile?.phoneNumber || 'N/A'}
                    >
                      {user.profile?.phoneNumber || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.lastGiftAtOrder || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
