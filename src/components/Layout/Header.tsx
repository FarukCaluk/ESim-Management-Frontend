import React from 'react';
import { Navbar, Container, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    window.location.href = '/login';
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar
      bg="primary"
      variant="dark"
      className="mb-4 flex-column align-items-start"
      style={{ minHeight: 80 }}
    >
      <Container fluid className="flex-column align-items-start">
        <Navbar.Brand style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {t('common:appName')}
        </Navbar.Brand>
        <div className="d-flex gap-2 mt-2">
          {children}
          <Dropdown>
            <Dropdown.Toggle variant="outline-light" size="sm">
              {i18n.language.toUpperCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
              <Dropdown.Item onClick={() => changeLanguage('de')}>Deutsch</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button
            variant="outline-light"
            size="sm"
            className="logout-btn"
            onClick={handleLogout}
            title={t('common:logout')}
          >
            {t('common:logout')}
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
