import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const OrderManagementScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/orders/all'); // Adjust endpoint if required
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Place an order and update state
  const handlePlaceOrder = async (orderId) => {
    try {
      await axios.post('/api/orders/place', { orderId }); // Ensure API works as expected
      toast.success('Order placed successfully');

      // Update state: Remove the placed order
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  // Delete an order and update state
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`/api/orders/${orderId}`); // Ensure API works as expected
      toast.success('Order deleted successfully');

      // Update state: Remove the deleted order
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order');
    }
  };

  // Render UI
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="order-management-screen">
      <h1>Order Management</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total Price</th>
              <th>Shipping Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>${Number(order.totalPrice).toFixed(2)}</td>
                <td>{order.shippingAddress}</td>
                <td>{order.status || 'Pending'}</td>
                <td>
                  {order.status !== 'Completed' ? (
                    <>
                      <button
                        onClick={() => handlePlaceOrder(order.id)}
                        disabled={order.status === 'Completed'}
                      >
                        Place Order
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        style={{ marginLeft: '10px', color: 'red' }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span>Order Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderManagementScreen;
