import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Role } from '../../types/roles';
import { getProfile, updateProfile, Profile } from '../../api/profile';
import { PanelLeft, PanelLeftOpen } from 'lucide-react';

const Header: React.FC<{
  children?: React.ReactNode;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}> = ({ children, sidebarOpen, onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const role = (sessionStorage.getItem('role') ||
    localStorage.getItem('role') ||
    null) as Role | null;

  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        setProfile(data);
        setName(data.name);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateProfile({ name });
    setProfile(updated);
    setOpen(false);
  };

  const welcomeName = profile?.name ?? role ?? t('user');

  return (
    <>
      {/* Gradient header with soft border and nicer button group */}
      <header className="mb-6 border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
                {(profile?.name || 'U').slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold text-primary">
                  {loading ? t('loading') : `${t('welcome')}, ${welcomeName}`}
                </h1>
                {profile?.email && (
                  <div className="truncate text-xs text-foreground/60">{profile.email}</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex overflow-hidden rounded-md border border-input bg-background shadow-sm">
              <button
                type="button"
                className="h-9 px-3 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => i18n.changeLanguage('en')}
              >
                EN
              </button>
              <div className="h-9 w-px bg-border" />
              <button
                type="button"
                className="h-9 px-3 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                onClick={() => setOpen(true)}
                disabled={loading}
              >
                {t('Edit Profile')}
              </button>
            </div>

            {onToggleSidebar && (
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={onToggleSidebar}
                title={sidebarOpen ? t('hideSidebar') : t('showSidebar')}
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <PanelLeft size={18} /> : <PanelLeftOpen size={18} />}
              </button>
            )}

            {children}
          </div>
        </div>
      </header>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background/95 p-6 shadow-xl">
            <div className="mb-4 text-lg font-semibold">{t('Profile')}</div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">{t('name')}</label>
                <input
                  className="block h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('namePlaceholder')}
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setOpen(false)}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
