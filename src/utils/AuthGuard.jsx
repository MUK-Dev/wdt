import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import Loader from '../components/ui/Loader';
import useAuth from '../hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //
const AuthGuard = ({ children, path = '/' }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsAuthenticated(true);
      navigate(path, { replace: true });
    } else if (isLoggedIn) {
      setIsAuthenticated(true);
      navigate('/home', { replace: true });
    } else {
      setIsAuthenticated(true);
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return isAuthenticated ? (
    children
  ) : (
    <Box sx={{ width: '100%', position: 'fixed', height: '100%' }}>
      <Loader />
    </Box>
  );
};

export default AuthGuard;
