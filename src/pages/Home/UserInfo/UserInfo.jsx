import React from 'react';
import { Grid, Paper, Typography, Stack, Avatar, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { VerifiedOutlined, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import useFirebase from '../../../hooks/useFirebase';

const UserInfo = ({ setIsLoading }) => {
  const { user, logout } = useFirebase();
  const navigate = useNavigate();
  const theme = useTheme();
  const main = theme.palette.primary.main;
  const success = theme.palette.success.dark;
  return (
    <Paper
      sx={{
        padding: '1em 0 0 0',
        display: 'flex',
        position: 'relative',
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
            sx={{
              width: 75,
              height: 75,
              background: 'none',
              position: 'absolute',
              top: -55,
            }}
          />
          <Grid container direction='row' justifyContent='center'>
            <Typography variant='h3' color={success}>
              {user.name}
            </Typography>
            {user.verified && (
              <VerifiedOutlined
                htmlColor={success}
                sx={{ marginLeft: '0.3em' }}
              />
            )}
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
            onClick={() => navigate('/profile')}
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
