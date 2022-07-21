import React, { useState } from 'react';
import { Grid, Container } from '@mui/material';

import { motion } from 'framer-motion';

import AuthGuard from '../../utils/AuthGuard';
import ListSection from './ListSection/ListSection';
import UserInfo from './UserInfo/UserInfo';
import Notifications from './Notifications/Notifications';
import Loader from '../../components/ui/Loader';

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

  return (
    <AuthGuard>
      {isLoading && <Loader />}
      <Container maxWidth='xl'>
        <Grid
          container
          direction='row'
          gap='2vh'
          height='100vh'
          maxHeight='100vh'
          justifyContent='center'
          alignItems='center'
        >
          <Grid item sm={5} xs={12}>
            <ListSection />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Grid
              container
              direction='column'
              gap='2vh'
              component={motion.div}
              variants={right}
              initial='hidden'
              animate='show'
              exit='exit'
              transition={{ duration: 1 }}
            >
              <UserInfo setIsLoading={setIsLoading} />
              <Notifications />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AuthGuard>
  );
};

export default Home;
