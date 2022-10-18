import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext)

  return (
    <h1>Dashboard: {user?.email}</h1>
  );
}

export default Dashboard;
