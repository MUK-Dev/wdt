import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import Login from './pages/auth/Login/Login';
import theme from './theme/theme';
import Register from './pages/auth/Register/Register';
import { FirebaseProvider as AuthProvider } from './contexts/FirebaseContext';
import Home from './pages/Home/Home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <CssBaseline />
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/home' element={<Home />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
