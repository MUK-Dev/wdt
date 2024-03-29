import { useContext } from 'react';

// auth provider
import AuthContext from '../contexts/FirebaseContext';

// ==============================|| AUTH HOOKS ||============================== //

const useFirebase = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useFirebase;
