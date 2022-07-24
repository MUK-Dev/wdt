import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import Login from './pages/auth/Login/Login';
import theme from './theme/theme';
import Register from './pages/auth/Register/Register';
import { FirebaseProvider as AuthProvider } from './contexts/FirebaseContext';
import Home from './pages/Home/Home';
import CheckListPage from './pages/CheckListPage/CheckListPage';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <BrowserRouter>
            <CssBaseline />
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/home' element={<Home />} />
              <Route path='/checklist' element={<CheckListPage />} />
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
