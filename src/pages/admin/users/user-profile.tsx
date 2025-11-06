import React from 'react';
import { useParams } from 'react-router-dom';
import { useAPI } from '../../../hooks/use-api';
import { User } from '../../../types/user.types';

const API =
  ((import.meta as any)?.env?.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api';

function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra || {}),
  };
}

async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${API.replace(/\/$/, '')}/users/${id}`, {
    credentials: 'include',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const data = await res.json();
  return data?.user ?? data;
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
  const { data: user, loading, error } = useAPI(() => getUserById(id!));

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-5 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Error loading user: {error.message}
      </div>
    );
  }
  if (!user) return <p className="text-sm text-foreground/70">User not found.</p>;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4">
        <Avatar url={user.profile?.avatarUrl} name={user.name} />
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold text-foreground">{user.name}</h2>
          <div className="mt-1 text-sm text-foreground/70">{user.email}</div>
        </div>
        <div className="ml-auto">
          <Badge on={!!user.verified} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <Row label="User ID" value={<span className="break-all">{user._id}</span>} />
          <Row label="Type" value={user.type} />
          <Row label="Language" value={user.language} />
          <Row label="Currency" value={user.currency} />
          <Row label="Phone" value={user.profile?.phoneNumber || 'N/A'} />
          <Row
            label="Created"
            value={user.createdAt ? new Date(user.createdAt as any).toLocaleString() : '-'}
          />
        </div>
        <div>
          <Row label="Credits" value={user.credits} />
          <Row label="Total Orders" value={user.totalOrders} />
          <Row label="Last Gift Order" value={user.lastGiftAtOrder || 'N/A'} />
          <Row label="Verified" value={<Badge on={!!user.verified} />} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
