import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/routes';
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
              to={ROUTES.SIMCARDS}
              className={`nav-link${location.pathname === ROUTES.SIMCARDS ? ' active' : ''}`}
            >
              {t('simcards:simCards')}
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link
              to={ROUTES.USERS}
              className={`nav-link${location.pathname === ROUTES.USERS ? ' active' : ''}`}
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
