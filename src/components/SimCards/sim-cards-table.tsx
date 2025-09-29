import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { useAPI } from '../../api/hooks/use-api'; // same as Users table
import { getSimCards } from '../../api/models/simcard-modul';
import { SimCard } from '../../types/type-simcard';

export const SimCardsTable: React.FC = () => {
  const { data: simCards, loading, error } = useAPI<SimCard[]>(getSimCards);

  if (loading) return <p>Loading SIM cards...</p>;
  if (error) return <p>Error loading SIM cards.</p>;

  const getReservedBadge = (reserved: boolean) => (
    <Badge bg={reserved ? 'success' : 'secondary'}>{reserved ? 'Yes' : 'No'}</Badge>
  );

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>ICCID</th>
          <th>User ID</th>
          <th>Provider ID</th>
          <th>Order ID</th>
          <th>Comment</th>
          <th>Reserved</th>
          <th>Expiration</th>
        </tr>
      </thead>
      <tbody>
        {simCards?.map((sim: SimCard) => (
          <tr key={sim._id}>
            <td>{sim._id}</td>
            <td>{sim.iccid}</td>
            <td>{sim.userId || '-'}</td>
            <td>{sim.providerId || '-'}</td>
            <td>{sim.orderId || '-'}</td>
            <td>{sim.comment || '-'}</td>
            <td>{getReservedBadge(sim.reserved)}</td>
            <td>{sim.expirationDate ? new Date(sim.expirationDate).toLocaleDateString() : '-'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
