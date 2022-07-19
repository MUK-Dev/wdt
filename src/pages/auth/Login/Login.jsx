import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../../../components/forms/auth-forms/AuthLogin/AuthLogin';
import Logo from '../../../components/ui/Logo';
import AuthGuard from '../../../utils/AuthGuard';
import { useState } from 'react';
import Loader from '../../../components/ui/Loader';
// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthGuard>
      {isLoading && <Loader />}
      <AuthWrapper>
        <Grid
          container
          direction='column'
          justifyContent='flex-end'
          sx={{ minHeight: '100vh' }}
        >
          <Grid item xs={12}>
            <Grid
              container
              justifyContent='center'
              alignItems='center'
              sx={{ minHeight: 'calc(100vh - 68px)' }}
            >
              <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                <AuthCardWrapper>
                  <Grid
                    container
                    spacing={2}
                    alignItems='center'
                    justifyContent='center'
                  >
                    <Grid item sx={{ mb: 3 }}>
                      <Link to='#'>
                        <Logo />
                      </Link>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        container
                        direction={matchDownSM ? 'column-reverse' : 'row'}
                        alignItems='center'
                        justifyContent='center'
                      >
                        <Grid item>
                          <Stack
                            alignItems='center'
                            justifyContent='center'
                            spacing={1}
                          >
                            <Typography
                              color={theme.palette.secondary.main}
                              gutterBottom
                              variant={matchDownSM ? 'h4' : 'h3'}
                            >
                              Hi, Welcome Back
                            </Typography>
                            <Typography
                              variant='caption'
                              fontSize='16px'
                              textAlign={matchDownSM ? 'center' : 'inherit'}
                            >
                              Enter your credentials to continue
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <AuthLogin setIsLoading={setIsLoading} />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        item
                        container
                        direction='column'
                        alignItems='center'
                        xs={12}
                      >
                        <Typography
                          component={Link}
                          to='/register'
                          variant='subtitle1'
                          sx={{ textDecoration: 'none' }}
                        >
                          Don&apos;t have an account?
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </AuthCardWrapper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AuthWrapper>
    </AuthGuard>
  );
};

export default Login;
