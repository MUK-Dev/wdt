import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

import { getRole } from '../../../utils/get-role';

const UsersSection = ({ users }) => {
  const theme = useTheme();
  const usersAnimation = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  };
  return (
    <Grid item>
      <Paper
        sx={{
          minHeight: '53vh',
          maxHeight: '53vh',
          overflow: 'auto',
          padding: '1em',
        }}
      >
        <Typography
          variant='h3'
          color={theme.palette.success.dark}
          align='center'
        >
          Users
        </Typography>
        <List sx={{ width: '100%' }}>
          {users &&
            users.map((u, i) => (
              <motion.div
                variants={usersAnimation}
                initial='initial'
                animate='animate'
                transition={{ delay: 0.2 * i }}
                key={u.uid}
              >
                <ListItem disablePadding>
                  <ListItemAvatar>
                    <Avatar
                      sx={{ background: 'transparent' }}
                      alt={u.name}
                      src={u.avatar}
                      referrerPolicy='no-referrer'
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={u.name}
                    secondary={
                      <Typography
                        sx={{ display: 'inline' }}
                        component='span'
                        variant='body2'
                        color='text.primary'
                      >
                        {getRole(u.role)}
                      </Typography>
                    }
                  />
                </ListItem>
              </motion.div>
            ))}
        </List>
      </Paper>
    </Grid>
  );
};

export default UsersSection;
