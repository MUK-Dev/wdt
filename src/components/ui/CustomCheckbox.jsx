import React from 'react';
import { motion } from 'framer-motion';
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import moment from 'moment';
import { DeleteForever } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const CustomCheckbox = ({
  created,
  index,
  checked,
  onChange,
  task,
  isManager,
  removeItem,
}) => {
  const date = new Date(created.toDate());
  const theme = useTheme();
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
      style={{ width: '100%', paddingRight: '0.5em' }}
    >
      <Grid
        container
        direction='row'
        justifyContent='flex-start'
        alignItems='center'
        flexWrap='nowrap'
      >
        <Grid item flexGrow={1}>
          <Stack direction='row' alignItems='center'>
            {isManager && (
              <IconButton
                size='small'
                sx={{ marginRight: '0.5em' }}
                onClick={removeItem}
              >
                <DeleteForever
                  sx={{ width: 20, height: 20 }}
                  htmlColor={theme.palette.error.main}
                />
              </IconButton>
            )}

            <FormControlLabel
              control={<Checkbox color='success' checked={checked} />}
              sx={{ fontSize: '2rem' }}
              label={task}
              onChange={onChange}
            />
          </Stack>
        </Grid>
        <Grid item>
          <Typography variant='caption'>
            {moment(date).format('h:mm a LL')}
          </Typography>
        </Grid>
      </Grid>
      <Divider variant='middle' />
    </motion.div>
  );
};

export default CustomCheckbox;
