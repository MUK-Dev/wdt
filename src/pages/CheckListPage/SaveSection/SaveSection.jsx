import React from 'react';
import { Grid, Paper, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SaveSection = ({ onClick, disableButton, changeDone }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        padding: '1em',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Grid container direction='column' alignItems='center'>
        <Button
          variant='contained'
          color='success'
          onClick={onClick}
          disabled={disableButton}
          sx={{
            color: theme.palette.primary.light,
            padding: '1em 2em',
          }}
        >
          Save
        </Button>
        <Typography
          variant='h4'
          color={theme.palette.primary.main}
          marginTop='2vh'
          align='center'
        >
          {changeDone ? 'Save Changes' : 'Edit List to Save'}
        </Typography>
      </Grid>
    </Paper>
  );
};

export default SaveSection;
