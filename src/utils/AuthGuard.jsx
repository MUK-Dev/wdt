import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import Loader from '../components/ui/Loader';
import useFirebase from '../hooks/useFirebase';

// ==============================|| AUTH GUARD ||============================== //
const AuthGuard = ({ children, path = '/' }) => {
  const { isLoggedIn } = useFirebase();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsAuthenticated(true);
      navigate(path, { replace: true });
    } else if (isLoggedIn) {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/register')
        navigate('/home', { replace: true });
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(true);
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate, path]);

  return isAuthenticated ? (
    children
  ) : (
    <Box sx={{ width: '100%', position: 'fixed', height: '100%' }}>
      <Loader />
    </Box>
  );
};

export default AuthGuard;
