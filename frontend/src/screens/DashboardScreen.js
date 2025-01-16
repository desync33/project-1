import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get('/api/orders/dashboard');
        setDashboardData(data);
      } catch (error) {
        setError(error.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="dashboard-screen">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-stats">
        <div
          onClick={() => navigate('/dashboard/users')}
          className="dashboard-item"
        >
          <h2>Total Users</h2>
          <p>{dashboardData.totalUsers}</p>
        </div>
        <div
          onClick={() => navigate('/dashboard/orders')}
          className="dashboard-item"
        >
          <h2>Total Orders</h2>
          <p>{dashboardData.totalOrders}</p>
        </div>
        <div className="dashboard-item">
          <h2>Total Revenue</h2>
          <p>${dashboardData.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
