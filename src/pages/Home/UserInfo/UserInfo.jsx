import React from 'react';
import { Grid, Paper, Typography, Stack, Avatar, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { VerifiedOutlined, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';

const UserInfo = ({ setIsLoading }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const main = theme.palette.primary.main;
  return (
    <Paper
      sx={{
        minHeight: '39vh',
        padding: '1vh 0 0 0',
        display: 'flex',
      }}
    >
      <Stack
        direction='column'
        justifyContent='stretch'
        spacing={2}
        sx={{ minHeight: '100%', width: '100%' }}
      >
        <Stack
          direction='column'
          alignItems='center'
          spacing={2}
          sx={{ height: '100%' }}
        >
          <Avatar
            src={user.avatar}
            alt={user.name}
            referrerPolicy='no-referrer'
            sx={{ width: 75, height: 75, background: 'none' }}
          />
          <Grid container direction='row' justifyContent='center'>
            <Typography variant='h3' color={main}>
              {user.name}
            </Typography>
            {user.verified && <VerifiedOutlined htmlColor={main} />}
          </Grid>
          <Typography variant='h4' color={main}>
            {user.email}
          </Typography>
          {user.company && (
            <Typography variant='h4' color={main}>
              Associated with {user.company}
            </Typography>
          )}
          <Button
            variant='text'
            color='success'
            sx={{ color: theme.palette.success.dark }}
          >
            Edit Profile
          </Button>
        </Stack>
        <Button
          variant='contained'
          color='success'
          disableElevation
          onClick={async () => {
            setIsLoading(true);
            try {
              setIsLoading(false);
              await logout();
              navigate('/');
            } catch (e) {
              setIsLoading(false);
            }
          }}
          sx={{
            color: theme.palette.success.light,
            fontSize: '1rem',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          fullWidth
        >
          <Logout />
        </Button>
      </Stack>
    </Paper>
  );
};

export default UserInfo;
