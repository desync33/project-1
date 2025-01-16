import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/users');
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('Cannot delete an admin user');
        } else {
          alert('Failed to delete user');
        }
      }
    }
  };

  return (
    <div className="user-management-screen">
      <h1>User Management</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  {!user.isAdmin ? (
                    <button onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  ) : (
                    <button disabled title="Cannot delete admin user">
                      Delete
                    </button>
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

export default UserManagementScreen;
