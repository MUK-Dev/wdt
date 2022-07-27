import React from 'react';
import {
  Paper,
  Typography,
  ListItem,
  ListItemText,
  Stack,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

import useAuth from '../../../hooks/useAuth';
import Loader from '../../../components/ui/Loader';
import { newDeadlineNotifications } from '../../../utils/near-deadline-notifications';

const Notifications = ({ lists }) => {
  const theme = useTheme();

  const notificationAnimation = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0.5,
    },
  };
  const { notifications, notificationLoading } = useAuth();

  return (
    <Paper
      sx={{
        minHeight: '100%',
        padding: '1em',
        position: 'relative',
      }}
    >
      {notificationLoading && <Loader />}
      <Stack direction='column'>
        <Typography
          align='center'
          variant='h3'
          color={theme.palette.success.dark}
        >
          Notifications
        </Typography>

        {[...newDeadlineNotifications(lists), ...notifications].length > 0 ? (
          <AnimatePresence>
            {[...newDeadlineNotifications(lists), ...notifications].map(
              (n, i) => (
                <motion.div
                  variants={notificationAnimation}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  transition={{ delay: 0.2 * i }}
                  key={i}
                >
                  <ListItem disablePadding sx={{ wordWrap: 'break-word' }}>
                    <ListItemText primary={n.roomTitle} secondary={n.message} />
                  </ListItem>
                  <Divider variant='middle' />
                </motion.div>
              )
            )}
          </AnimatePresence>
        ) : (
          <Typography align='center' variant='h5'>
            No new notifications
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default Notifications;
