import React from 'react';
import { useParams } from 'react-router-dom';
import { useAPI } from '../../../hooks/use-api';
import { User } from '../../../types/user.types';
import api from '../../../utils/api-client';
import Spinner from '../../../components/ui/spinner';
import ErrorAlert from '../../../components/ui/error-alert';

async function getUserById(id: string): Promise<User> {
  const res = await api.get(`/users/${id}`);
  return res.data?.user ?? res.data;
}

async function updateUser(id: string, body: { name?: string; email?: string; password?: string }) {
  const res = await api.put(`/users/${id}`, body);
  return res.data?.user ?? res.data;
}

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
      className="h-16 w-16 rounded-full object-cover"
      loading="lazy"
    />
  ) : (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-base font-semibold text-primary">
      {initials}
    </div>
  );
};

const Badge: React.FC<{ on: boolean }> = ({ on }) => (
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

const Row: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="flex gap-3 py-2 text-sm">
    <div className="w-40 shrink-0 text-foreground/60">{label}</div>
    <div className="text-foreground">{value ?? '-'}</div>
  </div>
);

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const fetchUser = React.useCallback(() => getUserById(id!), [id]);
  const { data: user, loading, error } = useAPI(fetchUser, [id]);

  const [userView, setUserView] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (user) setUserView(user);
  }, [user]);

  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });

  React.useEffect(() => {
    if (userView) {
      setForm({
        name: userView.name || '',
        email: userView.email || '',
        password: '',
      });
    }
  }, [userView]);

  const onSave = async () => {
    if (!userView?._id) return;
    setSaving(true);
    setErr(null);
    try {
      const payload: { name?: string; email?: string; password?: string } = {};
      if (form.name.trim() && form.name !== userView.name) payload.name = form.name.trim();
      if (form.email.trim() && form.email !== userView.email) payload.email = form.email.trim();
      if (form.password.trim()) payload.password = form.password.trim();

      if (!Object.keys(payload).length) {
        setEditing(false);
        setSaving(false);
        return;
      }

      const updated = await updateUser(userView._id as string, payload);
      // IMMEDIATE UI UPDATE
      const merged = { ...userView, ...updated };
      setUserView(merged);
      setForm({ name: merged.name || '', email: merged.email || '', password: '' });
      setEditing(false);
    } catch (e: any) {
      setErr(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !userView) {
    return <Spinner className="h-32 w-full rounded-xl border border-border bg-card" />;
  }
  if (error) {
    return <ErrorAlert message={`Error loading user: ${error.message}`} />;
  }
  if (!userView) return <p className="text-sm text-foreground/70">User not found.</p>;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4 pb-4">
        <Avatar url={userView.profile?.avatarUrl} name={userView.name} />
        <div className="min-w-0 flex-1">
          {!editing ? (
            <>
              <h2 className="truncate text-xl font-semibold text-foreground">{userView.name}</h2>
              <div className="mt-1 text-sm text-foreground/70">{userView.email}</div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Name</label>
                <input
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Email</label>
                <input
                  type="email"
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Password (leave blank to keep)
                </label>
                <input
                  type="password"
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge on={!!userView.verified} />
          {!editing ? (
            <button
              type="button"
              className="mt-2 h-9 rounded-md border border-border bg-background px-3 text-sm hover:bg-accent"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                className="h-9 rounded-md border border-border bg-background px-3 text-sm hover:bg-accent disabled:opacity-50"
                onClick={() => {
                  setEditing(false);
                  setForm({ name: userView.name || '', email: userView.email || '', password: '' });
                  setErr(null);
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
          {err && (
            <div className="text-xs text-destructive mt-1 max-w-[160px] text-right">{err}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <Row label="User ID" value={<span className="break-all">{userView._id}</span>} />
          <Row label="Type" value={userView.type} />
          <Row label="Language" value={userView.language} />
          <Row label="Currency" value={userView.currency} />
          <Row label="Phone" value={userView.profile?.phoneNumber || 'N/A'} />
          <Row
            label="Created"
            value={userView.createdAt ? new Date(userView.createdAt as any).toLocaleString() : '-'}
          />
        </div>
        <div>
          <Row label="Credits" value={userView.credits} />
          <Row label="Total Orders" value={userView.totalOrders} />
          <Row label="Last Gift Order" value={userView.lastGiftAtOrder || 'N/A'} />
          <Row label="Verified" value={<Badge on={!!userView.verified} />} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
