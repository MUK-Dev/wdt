import React from 'react';
import { Paper, Stack, Typography, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ShareSection = ({ url }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ minHeight: '20vh', padding: '1em' }}>
      <Stack direction='column' justifyContent='center' alignItems='center'>
        <Typography
          variant='h3'
          color={theme.palette.success.dark}
          gutterBottom
        >
          Share
        </Typography>
        <TextField
          label='Link'
          multiline
          rows={4}
          value={url}
          onFocus={(e) => e.target.select()}
          margin='dense'
          inputProps={{ readOnly: true }}
          color='success'
        />
      </Stack>
    </Paper>
  );
};

export default ShareSection;
