import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Layout.css';

const Sidebar: React.FC<{ open: boolean }> = ({ open }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div
      className={`sidebar${open ? '' : ' collapsed'} d-flex flex-column justify-content-between`}
    >
      <div>
        <div className="d-flex justify-content-between align-items-center px-2">
          <h4 className="mb-4">{t('simcards:title')}</h4>
        </div>
        <Nav className="flex-column">
          <Nav.Item>
            <Link
              to="/simcards"
              className={`nav-link${location.pathname === '/simcards' ? ' active' : ''}`}
            >
              {t('simcards:simCards')}
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link
              to="/users"
              className={`nav-link${location.pathname === '/users' ? ' active' : ''}`}
            >
              {t('users:title')}
            </Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
