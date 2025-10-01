import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaIdCard, FaUsers } from 'react-icons/fa'; // Only use these two
import './Layout.css';

const Sidebar: React.FC<{ open: boolean }> = ({ open }) => {
  const location = useLocation();

  return (
    <div
      className={`sidebar${open ? '' : ' collapsed'} d-flex flex-column justify-content-between`}
    >
      <div>
        <div className="d-flex justify-content-between align-items-center px-2">
          <h4 className="mb-4">ESim Manager</h4>
        </div>
        <Nav className="flex-column">
          <Nav.Item>
            <Link
              to="/simcards"
              className={`nav-link${location.pathname === '/simcards' ? ' active' : ''}`}
            >
              SIM Cards
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link
              to="/users"
              className={`nav-link${location.pathname === '/users' ? ' active' : ''}`}
            >
              Users
            </Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
