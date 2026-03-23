import React, { useState } from 'react';
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import '../../styles/layout.css';

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
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
      className={`app-shell${collapsed ? ' sidebar-collapsed' : ''} min-h-screen bg-gradient-to-b from-background to-muted/40 text-foreground`}
    >
      <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />

      <div className={['min-h-screen transition-[padding] duration-200', padLeft].join(' ')}>
        <Header sidebarOpen={!collapsed} onToggleSidebar={toggleCollapsed} />

        <main className="px-4 pb-10 pt-2 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-screen-2xl">
            <div className="rounded-2xl border border-border bg-card/95 p-4 shadow-sm ring-1 ring-black/5 sm:p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
