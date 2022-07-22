import React, { useState } from 'react';
import { Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AccessList = () => {
  const theme = useTheme();
  const [linkText, setLinkText] = useState('');
  const navigate = useNavigate();
  const isValidURL = (string) => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  };
  return (
    <Paper sx={{ minHeight: '10vh', padding: '1vh' }}>
      <Typography
        variant='body1'
        gutterBottom
        color={theme.palette.primary.main}
        align='center'
      >
        Enter the link shared to you to access list
      </Typography>
      <Grid container justifyContent='center' alignItems='center'>
        <Grid item xs={11}>
          <TextField
            variant='outlined'
            label='Link'
            fullWidth
            value={linkText}
            onChange={({ target: { value } }) => setLinkText(value)}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            color='success'
            onClick={() => {
              if (isValidURL(linkText)) {
                const url = new URL(linkText);
                navigate(url.pathname + url.search);
              }
            }}
          >
            <ArrowForward />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccessList;
