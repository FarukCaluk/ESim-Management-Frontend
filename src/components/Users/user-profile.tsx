import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spinner } from 'react-bootstrap';
import { useAPI } from '../../hooks/use-api';

const getUser = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/users/${id}`);
  const data = await res.json();
  return data.user ? data.user : data;
};

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const { data: user, loading, error } = useAPI(() => getUser(id!));

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>Error loading user: {error.message}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <Card>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <div>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Last Gift Order:</strong> {user.lastGiftOrder}
          </p>
          <p>
            <strong>Total Orders:</strong> {user.totalOrders}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserProfile;
