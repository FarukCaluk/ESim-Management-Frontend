import React from 'react';
import { Card, Row, Col, Table, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t('dashboard.totalUsers'), value: 120 },
    { label: t('dashboard.totalPlans'), value: 15 },
    { label: t('dashboard.totalCollections'), value: 8 },
    { label: t('dashboard.totalRevenue'), value: '$5,000' },
  ];

  const recentActivity = [
    { action: 'User registered', date: '2025-10-14' },
    { action: 'New plan created', date: '2025-10-13' },
    { action: 'Collection updated', date: '2025-10-12' },
  ];

  return (
    <div>
      <h2>{t('dashboard.title', 'Dashboard')}</h2>
      <Row className="mb-4">
        {stats.map((stat, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Body>
                <Card.Title>{stat.label}</Card.Title>
                <Card.Text>{stat.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h4>{t('dashboard.recentActivity', 'Recent Activity')}</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('dashboard.activity', 'Activity')}</th>
            <th>{t('dashboard.date', 'Date')}</th>
          </tr>
        </thead>
        <tbody>
          {recentActivity.map((item, idx) => (
            <tr key={idx}>
              <td>{item.action}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-4">
        <Button variant="primary">{t('dashboard.addUser', 'Add User')}</Button>{' '}
        <Button variant="success">{t('dashboard.createPlan', 'Create Plan')}</Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
