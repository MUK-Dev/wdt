import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AddCircleOutline } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ListSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const left = {
    hidden: {
      x: -40,
      opacity: 0,
    },
    show: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -40,
      opacity: 0,
    },
  };
  return (
    <Paper
      sx={{
        minHeight: '80vh',
        maxHeight: '80vh',
        overflow: 'auto',
      }}
      component={motion.div}
      variants={left}
      initial='hidden'
      animate='show'
      exit='exit'
      transition={{ duration: 1 }}
    >
      <Stack
        alignItems='center'
        justifyContent='center'
        spacing={1}
        sx={{ paddingTop: '1vh 0' }}
      >
        <Button
          variant='text'
          sx={{
            flexDirection: 'column',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          color='success'
          fullWidth
          onClick={() => navigate('/checklist')}
        >
          <AddCircleOutline htmlColor={theme.palette.success.dark} />
        </Button>
      </Stack>
      <Typography
        variant='h3'
        sx={{ marginTop: '2vh' }}
        align='center'
        color={theme.palette.success.dark}
      >
        Your Lists
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary='First Title'
              secondary='sapiente libero maxime ducimus culpa aliquam est sint modi exercitationem, incidunt voluptas dolore eum. In, temporibus corporis. '
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Paper>
  );
};

export default ListSection;
