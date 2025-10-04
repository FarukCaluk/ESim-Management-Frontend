import React, { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} />
      <div className={`flex-grow-1${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="container-fluid">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
