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

import { getRole } from '../../../utils/get-role';

const UsersSection = ({ users }) => {
  const theme = useTheme();
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
              <ListItem disablePadding key={i}>
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
            ))}
        </List>
      </Paper>
    </Grid>
  );
};

export default UsersSection;
