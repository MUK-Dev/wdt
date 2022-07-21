import React from 'react';
import { Grid, Paper, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SaveSection = ({ onClick, disableButton }) => {
  const theme = useTheme();

  return (
    <Grid item>
      <Paper
        sx={{
          minHeight: '20vh',
          padding: '1em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
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
            Leaving without saving will discard all unsaved changes
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default SaveSection;
