import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const handleLogout = () => {
    // Add your logout logic here
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
        <Navbar.Brand style={{ fontSize: '1.5rem', fontWeight: 700 }}>ESim Management</Navbar.Brand>
        <div className="d-flex gap-2 mt-2">
          {children}
          <Button
            variant="outline-light"
            size="sm"
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
