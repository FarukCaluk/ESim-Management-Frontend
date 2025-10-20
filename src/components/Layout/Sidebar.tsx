import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/layout.css';
import { Role } from '../../types/roles';

const Sidebar: React.FC<{ open: boolean }> = ({ open }) => {
  const location = useLocation();
  const roleValue = localStorage.getItem('role') as Role | null;

  return (
    <div
      className={`sidebar${open ? '' : ' collapsed'} d-flex flex-column justify-content-between`}
    >
      <div>
        <div className="d-flex justify-content-between align-items-center px-2">
          <h4 className="mb-4">ESim Manager</h4>
        </div>
        <Nav className="flex-column">
          {/* Dashboard: all roles */}
          <Nav.Item>
            <Link
              to="/dashboard"
              className={`nav-link${location.pathname === '/dashboard' ? ' active' : ''}`}
            >
              Dashboard
            </Link>
          </Nav.Item>

          {/* SIM Cards: admin, support, agency */}
          {(roleValue === Role.Admin ||
            roleValue === Role.Support ||
            roleValue === Role.Agency) && (
            <Nav.Item>
              <Link
                to="/simcards"
                className={`nav-link${location.pathname === '/simcards' ? ' active' : ''}`}
              >
                SIM Cards
              </Link>
            </Nav.Item>
          )}

          {/* Users: admin, support */}
          {(roleValue === Role.Admin || roleValue === Role.Support) && (
            <Nav.Item>
              <Link
                to="/users"
                className={`nav-link${location.pathname === '/users' ? ' active' : ''}`}
              >
                Users
              </Link>
            </Nav.Item>
          )}

          {/* Packages: admin, support */}
          {(roleValue === Role.Admin || roleValue === Role.Support) && (
            <Nav.Item>
              <Link
                to="/packages"
                className={`nav-link${location.pathname === '/packages' ? ' active' : ''}`}
              >
                Packages
              </Link>
            </Nav.Item>
          )}

          {/* Collections: admin, support, agency */}
          {(roleValue === Role.Admin ||
            roleValue === Role.Support ||
            roleValue === Role.Agency) && (
            <Nav.Item>
              <Link
                to="/collections"
                className={`nav-link${location.pathname === '/collections' ? ' active' : ''}`}
              >
                Collections
              </Link>
            </Nav.Item>
          )}

          {/* Plans: admin, support, agency */}
          {(roleValue === Role.Admin ||
            roleValue === Role.Support ||
            roleValue === Role.Agency) && (
            <Nav.Item>
              <Link
                to="/plans"
                className={`nav-link${location.pathname === '/plans' ? ' active' : ''}`}
              >
                Plans
              </Link>
            </Nav.Item>
          )}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
