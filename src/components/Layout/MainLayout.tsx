import React, { useState } from 'react';
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import '../../styles/layout.css';

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Persisted collapsed state
  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem('sidebar:collapsed') === '1'
  );

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem('sidebar:collapsed', next ? '1' : '0');
      return next;
    });
  };

  const padLeft = collapsed ? 'pl-[72px]' : 'pl-64';

  return (
    <div
      className={`app-shell${collapsed ? ' sidebar-collapsed' : ''} min-h-screen bg-background text-foreground`}
    >
      <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />

      <div className={['min-h-screen transition-[padding] duration-200', padLeft].join(' ')}>
        <Header sidebarOpen={!collapsed} onToggleSidebar={toggleCollapsed} />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-screen-2xl">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
