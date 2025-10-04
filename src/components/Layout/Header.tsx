import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Header: React.FC<{
  children?: React.ReactNode;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}> = ({ children, sidebarOpen, onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    window.location.href = '/login';
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
          {role ? `${t('welcome')}, ${role}` : t('welcome')}
        </Navbar.Brand>
        <div className="d-flex gap-2 mt-2">
          <Button variant="outline-light" size="sm" onClick={() => i18n.changeLanguage('en')}>
            EN
          </Button>
          <Button variant="outline-light" size="sm" onClick={() => i18n.changeLanguage('bs')}>
            BS
          </Button>
          {onToggleSidebar && (
            <Button variant="outline-light" size="sm" onClick={onToggleSidebar}>
              {sidebarOpen ? t('hideSidebar') : t('showSidebar')}
            </Button>
          )}
          {children}
          <Button
            variant="outline-light"
            size="sm"
            className="logout-btn"
            onClick={handleLogout}
            title={t('logout')}
          >
            {t('logout')}
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
// filepath: c:\Users\Korisnik\Desktop\ESim-Management-Frontend\esim-frontend\src\components\Layout\Header.tsx
