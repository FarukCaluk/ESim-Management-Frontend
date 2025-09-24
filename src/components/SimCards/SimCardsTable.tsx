import React, { useEffect, useState } from 'react';
import { SimCard } from '../../types'; // koristi type koji smo napravili

const SimCardsTable: React.FC = () => {
  const [simCards, setSimCards] = useState<SimCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/simcards')
      .then((res) => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('API data:', data);
        setSimCards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching simcards:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <table>
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
        {simCards.map((sim) => (
          <tr key={sim._id}>
            <td>{sim._id}</td>
            <td>{sim.iccid}</td>
            <td>{sim.userId || '-'}</td>
            <td>{sim.providerId || '-'}</td>
            <td>{sim.orderId || '-'}</td>
            <td>{sim.comment}</td>
            <td>{sim.reserved ? 'Yes' : 'No'}</td>
            <td>{new Date(sim.expirationDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SimCardsTable;
