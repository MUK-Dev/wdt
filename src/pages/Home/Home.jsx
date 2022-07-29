import React, { useState, useEffect } from 'react';
import { Grid, Container } from '@mui/material';

import { motion } from 'framer-motion';

import AuthGuard from '../../utils/AuthGuard';
import ListSection from './ListSection/ListSection';
import UserInfo from './UserInfo/UserInfo';
import Notifications from './Notifications/Notifications';
import Loader from '../../components/ui/Loader';
import AccessList from './AccessList/AccessList';
import useFirebase from '../../hooks/useFirebase';

const Home = () => {
  const right = {
    hidden: {
      x: 40,
      opacity: 0,
    },
    show: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: 40,
      opacity: 0,
    },
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const { getUserLists, user, exitList } = useFirebase();

  const getData = async () => {
    setIsListLoading(true);
    try {
      const gotLists = await getUserLists(user.id);
      setLists(gotLists.reverse());
      setIsListLoading(false);
    } catch (e) {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const exitFromList = async (listId, uid) => {
    setIsLoading(true);
    try {
      await exitList(listId, uid);
      const newLists = lists.filter((l) => l.id !== listId);
      setLists(newLists);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <AuthGuard>
      {isLoading && <Loader />}
      <Container maxWidth='xl'>
        <Grid
          container
          direction='row'
          gap='1em'
          height='100vh'
          maxHeight='100vh'
          justifyContent='center'
          alignItems='center'
        >
          <Grid item sm={5} xs={12}>
            <ListSection
              isListLoading={isListLoading}
              lists={lists}
              exitFromList={(listId, uid) => exitFromList(listId, uid)}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Grid
              container
              direction='column'
              component={motion.div}
              variants={right}
              gap='1em'
              initial='hidden'
              animate='show'
              exit='exit'
              transition={{ duration: 1 }}
              height='80vh'
              justifyContent='space-between'
              flexWrap='nowrap'
            >
              <Grid item>
                <UserInfo setIsLoading={setIsLoading} />
              </Grid>
              <Grid item>
                <AccessList />
              </Grid>
              <Grid item flexGrow={1} overflow='auto'>
                <Notifications lists={lists} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AuthGuard>
  );
};

export default Home;
