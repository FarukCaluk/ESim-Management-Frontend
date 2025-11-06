import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Role } from '../../types/roles';
import {
  LayoutDashboard,
  CreditCard,
  Users as UsersIcon,
  Package,
  Layers,
  Map,
  LogOut,
} from 'lucide-react';

type SidebarProps = {
  collapsed?: boolean;
  onToggleCollapsed?: () => void; // kept for compatibility, not used here
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false /*, onToggleCollapsed*/ }) => {
  const location = useLocation();
  const rawRole = sessionStorage.getItem('role') || localStorage.getItem('role');
  const roleValue = (rawRole as Role | null) ?? null;

  const canAS = roleValue === Role.Admin || roleValue === Role.Support;
  const canASA = canAS || roleValue === Role.Agency;

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  type Item = {
    to: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    active: boolean;
    show?: boolean;
  };
  const items: Item[] = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/dashboard',
      show: true,
    },
    {
      to: '/simcards',
      label: 'Simcards',
      icon: CreditCard,
      active: location.pathname.startsWith('/simcards'),
      show: canASA,
    },
    {
      to: '/users',
      label: 'Users',
      icon: UsersIcon,
      active: location.pathname.startsWith('/users'),
      show: canAS,
    },
    {
      to: '/packages',
      label: 'Packages',
      icon: Package,
      active: location.pathname.startsWith('/packages'),
      show: canAS,
    },
    {
      to: '/collections',
      label: 'Collections',
      icon: Layers,
      active: location.pathname.startsWith('/collections'),
      show: canASA,
    },
    {
      to: '/plans',
      label: 'Plans',
      icon: Map,
      active: location.pathname.startsWith('/plans'),
      show: canASA,
    },
  ].filter((i) => i.show !== false);

  const railWidth = collapsed ? 'w-[72px]' : 'w-64';

  return (
    <aside
      className={[
        'fixed left-0 top-0 z-40 h-screen border-r border-border/80 bg-white/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70',
        'transition-[width] duration-200',
        railWidth,
      ].join(' ')}
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col">
        {/* Brand (removed local collapse control; use Header button) */}
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-blue-600 text-sm font-semibold text-white shadow-sm">
            E
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-slate-900">ESim Manager</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-2">
          {items.map(({ to, label, icon: Icon, active }) => (
            <div key={to} className="group relative">
              <Link
                to={to}
                className={[
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  collapsed ? 'justify-center' : '',
                  active
                    ? 'bg-blue-600/10 text-blue-800 ring-1 ring-inset ring-blue-600/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className={active ? 'text-blue-700' : 'text-slate-500'} />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span
                  className="pointer-events-none absolute left-[76px] top-1/2 -translate-y-1/2 rounded-md bg-slate-900/90 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                  role="tooltip"
                >
                  {label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto border-t px-2 py-3">
          <div className={['flex items-center gap-2', collapsed ? 'justify-center' : ''].join(' ')}>
            <button
              type="button"
              onClick={handleLogout}
              className={
                collapsed
                  ? 'inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  : 'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-slate-700 hover:bg-slate-100'
              }
              title="Logout"
            >
              <LogOut size={18} className="text-slate-600" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
