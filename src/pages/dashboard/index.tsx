import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { withSSRAuth } from '../../utils/withSSRAuth';

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext)

  return (
    <h1>Dashboard: {user?.email}</h1>
  );
}

export const getServerSideProps = withSSRAuth(async (context) => {
  return {
    props: {}
  }
});

export default Dashboard;
