import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Button,
  IconButton,
  Stack,
  Modal,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GppMaybe } from '@mui/icons-material';
import { motion } from 'framer-motion';

import { getRole } from '../../../utils/get-role';
import useAuth from '../../../hooks/useAuth';

const UsersSection = ({ users, isManager, setUsers, setIsLoading }) => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const listNo = searchParams.get('listNo');
  const { promoteUser } = useAuth();

  const usersAnimation = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  };

  const promote = async (index, toRole) => {
    setIsLoading(true);
    try {
      await promoteUser(listNo, users, index, toRole);
      const newList = [...users];
      newList[index].role = toRole;
      setUsers(newList);
      setIsLoading(false);
      setShowModal(false);
    } catch (e) {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <Grid item>
      <Paper
        sx={{
          minHeight: '55vh',
          maxHeight: '55vh',
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
                  <Grid
                    container
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Grid item xs={u.role === 1 ? 10 : 12}>
                      <Stack
                        direction='row'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Avatar
                          sx={{
                            background: 'transparent',
                            width: 34,
                            height: 34,
                            marginRight: '0.5em',
                          }}
                          alt={u.name}
                          src={u.avatar}
                          referrerPolicy='no-referrer'
                        />
                        <ListItemText
                          primary={u.name}
                          primaryTypographyProps={{
                            align: 'left',
                          }}
                          secondaryTypographyProps={{
                            align: 'left',
                          }}
                          secondary={getRole(u.role)}
                        />
                      </Stack>
                    </Grid>
                    {u.role === 1 && isManager && (
                      <Grid item xs={2}>
                        <Stack direction='column'>
                          <IconButton
                            onClick={() => setShowModal(true)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'transparent',
                              },
                            }}
                          >
                            <GppMaybe htmlColor={theme.palette.warning.main} />
                          </IconButton>
                          <Modal
                            open={showModal}
                            onClose={() => setShowModal(false)}
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Paper sx={{ padding: '1em' }}>
                              <Stack direction='column' alignItems='center'>
                                <Avatar
                                  sx={{
                                    background: 'transparent',
                                    width: 50,
                                    height: 50,
                                  }}
                                  alt={u.name}
                                  src={u.avatar}
                                  referrerPolicy='no-referrer'
                                />
                                <Typography variant='h3'>{u.name}</Typography>
                                <Typography variant='h4'>
                                  {getRole(u.role)}
                                </Typography>
                                <Stack
                                  direction='row'
                                  justifyContent='space-between'
                                >
                                  <Button onClick={() => promote(i, 2)}>
                                    Make User
                                  </Button>
                                  <Button onClick={() => promote(i, 0)}>
                                    Make Manager
                                  </Button>
                                </Stack>
                              </Stack>
                            </Paper>
                          </Modal>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </ListItem>
              </motion.div>
            ))}
        </List>
      </Paper>
    </Grid>
  );
};

export default UsersSection;
