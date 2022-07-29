import React, { useRef, useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { VerifiedOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import AuthGuard from '../../utils/AuthGuard';
import useFirebase from '../../hooks/useFirebase';
import EditableContent from '../../components/ui/EditableContent';
import Loader from '../../components/ui/Loader';

const Profile = () => {
  const theme = useTheme();
  const { user, updateUserInfo } = useFirebase();
  const [fname, setfName] = useState(user.fname);
  const [lname, setlName] = useState(user.lname);
  const [company, setCompany] = useState(
    user.company === '' ? 'Empty' : user.company
  );

  const [isLoading, setIsLoading] = useState(false);
  const [changeDone, setChangeDone] = useState(false);
  const firstRender = useRef(true);
  const secondRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (secondRender.current) {
      secondRender.current = false;
      return;
    }
    setChangeDone(true);
  }, [fname, lname, company]);

  const updateUser = async () => {
    setIsLoading(true);
    try {
      await updateUserInfo(user.id, fname, lname, company, user.provider);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <AuthGuard>
      {isLoading && <Loader />}
      <Container
        maxWidth='sm'
        sx={{
          padding: '1em',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{ padding: '5em 0 0 0', position: 'relative' }}>
          <Stack direction='column' alignItems='center'>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                width: 100,
                height: 100,
                background: 'transparent',
                position: 'absolute',
                top: -50,
              }}
              referrerPolicy='no-referrer'
            />
            <Typography
              gutterBottom
              variant='h1'
              color={theme.palette.success.dark}
            >
              Click to Edit {user.provider === 'google' && 'Company'}
            </Typography>
            <Divider />
            {user.verified && (
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                flexWrap='nowrap'
                gap='0.5em'
              >
                <Grid item>
                  <Typography
                    gutterBottom
                    variant='h3'
                    color={theme.palette.success.dark}
                  >
                    Verified
                  </Typography>
                </Grid>
                <Grid item>
                  {user.verified && (
                    <VerifiedOutlined htmlColor={theme.palette.success.dark} />
                  )}
                </Grid>
              </Grid>
            )}
            {user.provider === 'password' ? (
              <>
                {' '}
                <EditableContent
                  text={fname}
                  setText={setfName}
                  variant='h3'
                  title='First Name: '
                />
                <EditableContent
                  text={lname}
                  setText={setlName}
                  variant='h3'
                  title='Last Name: '
                />
              </>
            ) : (
              <Typography variant='h3' gutterBottom>
                {user.name}
              </Typography>
            )}

            <Typography variant='h3' gutterBottom>
              {user.email}
            </Typography>

            <EditableContent
              text={company}
              setText={setCompany}
              variant='h3'
              title='Accociated with: '
            />
            <Button
              onClick={updateUser}
              variant='contained'
              fullWidth
              disableElevation
              disabled={!changeDone}
              sx={{
                backgroundColor: theme.palette.success.dark,
                color: theme.palette.primary.light,
                marginTop: '1em',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                '&:hover': {
                  backgroundColor: theme.palette.success.main,
                },
              }}
            >
              Save
            </Button>
          </Stack>
        </Paper>
      </Container>
    </AuthGuard>
  );
};

export default Profile;
