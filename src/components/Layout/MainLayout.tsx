import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} />
      <div className={`flex-grow-1${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        <Header>
          <button
            className="btn btn-outline-light sidebar-toggle"
            style={{ marginRight: 16 }}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
        </Header>
        <div className="container-fluid">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
