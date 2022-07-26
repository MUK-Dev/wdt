import React, { useState } from 'react';
import { Box, Stack, Paper, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

import useAuth from '../../hooks/useAuth';
import Loader from './Loader';

const Modal = ({
  setShowModal,
  usersList,
  setUsersList,
  listNo,
  roomTitle,
}) => {
  const theme = useTheme();
  const { user, requestAccessToList, createNotification } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const backdrop = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };
  const modal = {
    initial: {
      opacity: 0,
      scale: 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0,
    },
  };

  const requestAccess = async () => {
    setIsLoading(true);
    try {
      await requestAccessToList(
        listNo,
        usersList,
        user.id,
        user.name,
        user.avatar,
        1
      );
      usersList.forEach(async (u) => {
        if (u.role === 0) {
          try {
            await createNotification(
              u.uid,
              `${user.name} has requested access to the list`,
              roomTitle
            );
          } catch (e) {
            console.log(e);
          }
        }
      });
      const newList = [...usersList];
      newList.push({
        name: user.name,
        uid: user.id,
        avatar: user.avatar,
        role: 1,
      });
      setUsersList(newList);
      setIsLoading(false);
      setShowModal(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={backdrop}
      initial='initial'
      animate='animate'
      exit='exit'
      key='ovnwo2n2402f'
    >
      {isLoading && <Loader />}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
        }}
      >
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='center'
          sx={{ height: '100%', width: '100%' }}
        >
          <motion.div
            variants={modal}
            initial='initial'
            animate='animate'
            exit='exit'
            key='vownovn2903230'
          >
            <Paper sx={{ width: '30vh', height: '15vh' }}>
              <Stack
                direction='column'
                justifyContent='space-between'
                height='100%'
              >
                <Typography
                  variant='h3'
                  color={theme.palette.error.main}
                  align='center'
                  margin='1em'
                >
                  You are not authorized to access this list
                </Typography>
                <Button
                  variant='contained'
                  sx={{
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                  disableElevation
                  onClick={requestAccess}
                  disabled={isLoading}
                >
                  Request Access?
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        </Stack>
      </Box>
    </motion.div>
  );
};

export default Modal;
