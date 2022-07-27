import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AddCircleOutline, ExitToApp } from '@mui/icons-material';
import { motion } from 'framer-motion';

import useAuth from '../../../hooks/useAuth';
import Loader from '../../../components/ui/Loader';

const ListSection = ({ lists, exitFromList, isListLoading }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const left = {
    hidden: {
      x: -40,
      opacity: 0,
    },
    show: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -40,
      opacity: 0,
    },
  };
  const listItemAnimation = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  };

  const list = (
    <>
      <Typography
        variant='h3'
        sx={{ marginTop: '2vh' }}
        align='center'
        color={theme.palette.success.dark}
      >
        Your Lists
      </Typography>
      <List>
        {lists?.map((l, index) => (
          <motion.div
            key={l.id}
            variants={listItemAnimation}
            initial='initial'
            animate='animate'
            transition={{ delay: 0.2 * index }}
          >
            <Grid container alignItems='stretch' flexWrap='nowrap'>
              <Grid item flexGrow={1}>
                <ListItem
                  disablePadding
                  sx={{ wordWrap: 'break-word' }}
                  onClick={() =>
                    navigate({
                      pathname: '/checklist',
                      search: `?listNo=${l.id}`,
                    })
                  }
                >
                  <ListItemButton>
                    <ListItemText primary={l.title} secondary={l.description} />
                  </ListItemButton>
                </ListItem>
              </Grid>
              <Grid item>
                <Button
                  size='small'
                  variant='contained'
                  color='error'
                  disableElevation
                  sx={{
                    height: '100%',
                    borderRadius: 0,
                    minWidth: 0,
                  }}
                  onClick={() => exitFromList(l.id, user.id)}
                >
                  <ExitToApp htmlColor={theme.palette.primary.light} />
                </Button>
              </Grid>
            </Grid>
            <Divider variant='middle' />
          </motion.div>
        ))}
      </List>
    </>
  );

  const createNewListMessage = (
    <>
      <Typography
        variant='h3'
        align='center'
        color={theme.palette.success.dark}
      >
        Create new list
      </Typography>
      <Typography
        variant='subtitle1'
        align='center'
        color={theme.palette.primary.main}
      >
        Click on the button above to start
      </Typography>
    </>
  );

  return (
    <Paper
      sx={{
        minHeight: '80vh',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative',
      }}
      component={motion.div}
      variants={left}
      initial='hidden'
      animate='show'
      exit='exit'
      transition={{ duration: 1 }}
    >
      {isListLoading && <Loader />}
      <Stack
        alignItems='center'
        justifyContent='center'
        spacing={1}
        sx={{ paddingTop: '1vh 0' }}
      >
        <Button
          variant='text'
          sx={{
            flexDirection: 'column',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          color='success'
          fullWidth
          onClick={() => navigate('/checklist')}
        >
          <AddCircleOutline htmlColor={theme.palette.success.dark} />
        </Button>
      </Stack>
      {lists.length !== 0 ? list : createNewListMessage}
    </Paper>
  );
};

export default ListSection;
