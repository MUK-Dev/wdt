import React from 'react';
import { motion } from 'framer-motion';
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
} from '@mui/material';
import moment from 'moment';

const CustomCheckbox = ({ created, index, checked, onChange, task }) => {
  const date = new Date(created.toDate());
  const listItemAnimation = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  };

  return (
    <motion.div
      key={index}
      variants={listItemAnimation}
      initial='initial'
      animate='animate'
      transition={{ delay: 0.1 * index }}
      style={{ width: '100%' }}
    >
      <Grid
        container
        direction='row'
        justifyContent='flex-start'
        alignItems='center'
      >
        <Grid item xs={10}>
          <FormControlLabel
            control={<Checkbox color='success' checked={checked} />}
            sx={{ fontSize: '2rem' }}
            label={task}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={2}>
          <Typography>{moment(date).format('h:mm a LL')}</Typography>
        </Grid>
        <Divider variant='middle' />
      </Grid>
    </motion.div>
  );
};

export default CustomCheckbox;
