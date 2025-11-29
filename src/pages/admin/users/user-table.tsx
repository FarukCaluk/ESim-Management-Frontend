import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../../hooks/use-api';
import { getUsers, createUser } from '../../../api/models/user.models';
import { User } from '../../../types/user.types';
import Spinner from '../../../components/ui/spinner';
import ErrorAlert from '../../../components/ui/error-alert';

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
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().slice(0, 64);
  const normalizedLower = normalizedQuery.toLowerCase();
  const [refreshToken, setRefreshToken] = useState(0);
  const fetchUsers = useCallback(
    () => getUsers(normalizedQuery || undefined),
    [normalizedQuery, refreshToken]
  );
  const {
    data: users,
    loading,
    error,
  } = useAPI<User[]>(fetchUsers, [normalizedQuery, refreshToken]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [list, setList] = useState<User[]>([]);
  useEffect(() => {
    if (users) setList(users);
  }, [users]);

  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const filtered = useMemo(() => {
    if (list.length === 0) return [];
    const base = normalizedLower
      ? list.filter((user: User) => (user.name ?? '').toLowerCase().includes(normalizedLower))
      : list;

    const cmp = (a: User, b: User) =>
      (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });

    return base.slice().sort((a: User, b: User) => (sortDir === 'asc' ? cmp(a, b) : cmp(b, a)));
  }, [list, normalizedLower, sortDir]);

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setCreateErr('Name, Email, Password required');
      return;
    }
    setCreating(true);
    setCreateErr(null);
    try {
      const created = await createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // Try to unwrap user if API nests it
      const createdUser: User | undefined =
        (created?.user as User) ||
        (created?.data?.user as User) ||
        (created?.data as User) ||
        (created?._id ? created : undefined);

      if (createdUser?.name) {
        // Optimistic: merge into list while refetch happens
        setList((prev) => [...prev, createdUser]);
      }

      // Always refetch authoritative list (no page reload)
      setRefreshToken((x) => x + 1);
      setShowCreate(false);
      setForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      setCreateErr(err.message || 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const isInitialLoad = loading && (!users || users.length === 0);

  if (isInitialLoad) {
    return <Spinner className="h-32 w-full rounded-xl border border-border bg-card" />;
  }

  if (error) {
    return <ErrorAlert message={`${t('error') || 'Error'}: ${error.message}`} />;
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
          {!readOnly && (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-white hover:bg-primary/90"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-[1100px] w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <tr className="border-y border-border text-foreground/80">
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
                <td className="px-4 py-8 text-center text-foreground/60" colSpan={11}>
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
      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !creating && setShowCreate(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Add User</h3>
            <form onSubmit={submitCreate} className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium">Name *</label>
                  <input
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Email *</label>
                  <input
                    type="email"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Password *</label>
                  <input
                    type="password"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    required
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

export default UserTable;
