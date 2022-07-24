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
import { ManageAccounts } from '@mui/icons-material';
import { motion } from 'framer-motion';

import { getRole } from '../../../utils/get-role';
import useAuth from '../../../hooks/useAuth';

const UsersSection = ({ users, isManager, setUsers, setIsLoading }) => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    name: '',
    role: '',
    avatar: '',
    index: '',
  });
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
    <Paper
      sx={{
        minHeight: '100%',
        padding: '1em',
        overflow: 'auto',
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
                  <Grid item xs={u.role === 1 || u.role === 2 ? 10 : 12}>
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
                  {(u.role === 1 || u.role === 2) && isManager && (
                    <Grid item xs={2}>
                      <Stack direction='column'>
                        <IconButton
                          onClick={() => {
                            setSelectedUser({
                              name: u.name,
                              avatar: u.avatar,
                              index: i,
                              role: u.role,
                            });
                            setShowModal(true);
                          }}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'transparent',
                            },
                          }}
                        >
                          <ManageAccounts
                            htmlColor={theme.palette.warning.main}
                          />
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
                                alt={selectedUser.name}
                                src={selectedUser.avatar}
                                referrerPolicy='no-referrer'
                              />
                              <Typography variant='h3'>
                                {selectedUser.name}
                              </Typography>
                              <Typography variant='h4'>
                                {getRole(selectedUser.role)}
                              </Typography>
                              <Stack
                                direction='row'
                                justifyContent='space-between'
                              >
                                {selectedUser.role === 1 && (
                                  <Button
                                    onClick={() =>
                                      promote(selectedUser.index, 2)
                                    }
                                  >
                                    Make User
                                  </Button>
                                )}
                                <Button
                                  onClick={() => promote(selectedUser.index, 0)}
                                >
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
  );
};

export default UsersSection;
