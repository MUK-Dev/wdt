import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from '../../../../hooks/useAuth';
import useScriptRef from '../../../../hooks/useScriptRef';
import Google from '../../../../assets/images/icons/social-google.svg';
import AnimateButton from '../../../ui/AnimateButton';
import {
  strengthColor,
  strengthIndicatorNumFunc,
} from '../../../../utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const AuthRegister = ({ setIsLoading, ...others }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = React.useState(false);
  const [checked, setChecked] = React.useState(true);

  const [strength, setStrength] = React.useState(0);
  const [level, setLevel] = React.useState();
  const { firebaseRegister, firebaseGoogleSignIn } = useAuth();

  const googleHandler = async () => {
    setIsLoading(true);
    try {
      await firebaseGoogleSignIn();
      setIsLoading(false);
      navigate('/home');
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicatorNumFunc(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  return (
    <>
      <Grid container direction='column' justifyContent='center' spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              variant='outlined'
              fullWidth
              onClick={googleHandler}
              size='large'
              sx={{
                color: 'grey.700',
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.dark.main
                    : theme.palette.grey[50],
                borderColor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.dark.light + 20
                    : theme.palette.grey[100],
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img
                  src={Google}
                  alt='google'
                  width={16}
                  height={16}
                  style={{ marginRight: matchDownSM ? 8 : 16 }}
                />
              </Box>
              Sign up with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ alignItems: 'center', display: 'flex' }}>
            <Divider sx={{ flexGrow: 1 }} orientation='horizontal' />
            <Button
              variant='outlined'
              sx={{
                cursor: 'unset',
                m: 2,
                py: 0.5,
                px: 7,
                borderColor:
                  theme.palette.mode === 'dark'
                    ? `${theme.palette.dark.light + 20} !important`
                    : `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]} !important`,
                fontWeight: 500,
                borderRadius: `8px`,
              }}
              disableRipple
              disabled
            >
              OR
            </Button>
            <Divider sx={{ flexGrow: 1 }} orientation='horizontal' />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          container
          alignItems='center'
          justifyContent='center'
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle1'>
              Sign up with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          fname: '',
          lname: '',
          company: '',
          email: '',
          password: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Must be a valid email')
            .max(255)
            .required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          fname: Yup.string().required('First name is required'),
          lname: Yup.string().required('Last name is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setIsLoading(true);
          try {
            await firebaseRegister(
              values.email,
              values.fname,
              values.lname,
              values.company,
              values.password
            ).then(
              () => {
                setIsLoading(false);
                navigate('/home');
              },
              (err) => {
                setIsLoading(false);
                console.log(err.message);
                setStatus({ success: false });
                if (err.code === 'auth/email-already-in-use')
                  setErrors({ email: 'Email Address already in use' });
                else if (err.code === 'auth/weak-password')
                  setErrors({ password: 'Password is weak' });
                else setErrors({ submit: 'Something went wrong' });
                setSubmitting(false);
              }
            );
          } catch (err) {
            setIsLoading(false);
            setStatus({ success: false });
            setErrors({ submit: 'Something went wrong' });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor='outlined-adornment-fname-register'>
                    First Name
                  </InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-fname-register'
                    type='fname'
                    value={values.fname}
                    name='fname'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.fname && errors.fname && (
                    <FormHelperText
                      error
                      id='standard-weight-helper-text-fname--register'
                    >
                      {errors.fname}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor='outlined-adornment-lname-register'>
                    Last Name
                  </InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-lname-register'
                    type='lname'
                    value={values.lname}
                    name='lname'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.lname && errors.lname && (
                    <FormHelperText
                      error
                      id='standard-weight-helper-text-lname--register'
                    >
                      {errors.lname}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor='outlined-adornment-company-register'>
                Company Name
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-company-register'
                type='company'
                value={values.company}
                name='company'
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.company && errors.company && (
                <FormHelperText
                  error
                  id='standard-weight-helper-text-company--register'
                >
                  {errors.company}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor='outlined-adornment-email-register'>
                Email Address / Username
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-email-register'
                type='email'
                value={values.email}
                name='email'
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id='standard-weight-helper-text--register'
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor='outlined-adornment-password-register'>
                Password
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-password-register'
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name='password'
                label='Password'
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                      size='large'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id='standard-weight-helper-text-password-register'
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item>
                      <Box
                        style={{ backgroundColor: level?.color }}
                        sx={{ width: 85, height: 8, borderRadius: '7px' }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant='subtitle1' fontSize='0.75rem'>
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            <Grid container alignItems='center' justifyContent='space-between'>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name='checked'
                      color='primary'
                    />
                  }
                  label={
                    <Typography variant='subtitle1'>
                      Agree with &nbsp;
                      <Typography variant='subtitle1' component={Link} to='#'>
                        Terms & Condition.
                      </Typography>
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  color='secondary'
                >
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
