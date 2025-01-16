import axios from 'axios';
import React, { useEffect, useState } from 'react';

const OrderScreen = ({ match }) => {
  const { id } = match.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Order {id}</h1>
      {/* Render order details */}
      {order && <div>Order status: {order.status}</div>}
    </div>
  );
};

export default OrderScreen;
