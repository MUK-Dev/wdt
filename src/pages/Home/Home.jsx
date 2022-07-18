import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <h3>Welcome {user?.name}</h3>
      <p>{user?.id}</p>
      <p>{user?.email}</p>
      <img
        src={user?.avatar}
        alt={user?.avatar}
        width='100'
        height='100'
        referrerpolicy='no-referrer'
      />
      <br />
      <br />
      <br />
      <br />
      <button
        onClick={async () => {
          await logout();
          navigate('/');
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
