import React, { useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Typography,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AddTaskRounded } from '@mui/icons-material';

import AuthGuard from '../../utils/AuthGuard';

const CheckListPage = () => {
  const [title, setTitle] = useState('Title');
  const [description, setDescription] = useState('Description');
  const [newItem, setNewItem] = useState('');
  const [list, setList] = useState([
    {
      description: 'first',
      checked: false,
    },
    {
      description: 'second',
      checked: false,
    },
    {
      description: 'third',
      checked: true,
    },
  ]);
  const theme = useTheme();

  const addNewItem = () => {
    if (newItem !== '') {
      const newArray = [...list];
      newArray.push({ checked: false, description: newItem });
      setList(newArray);
      setNewItem('');
    }
  };

  return (
    <AuthGuard>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        sx={{ padding: '1vh' }}
        gap='1vh'
      >
        <Grid item sm={6} xs={12}>
          <Grid container>
            <Paper
              sx={{
                minHeight: '95vh',
                padding: '1vh',
                width: '100%',
                display: 'flex',
              }}
            >
              <Grid container direction='column' justifyContent='space-between'>
                <Stack direction='column'>
                  <Typography
                    variant='h3'
                    contentEditable
                    sx={{ maxWidth: '100%' }}
                    onInput={({ target }) => setTitle(target.textContent)}
                    onBlur={({ target }) => setTitle(target.textContent)}
                  >
                    Title
                  </Typography>
                  <Typography
                    variant='h4'
                    contentEditable
                    sx={{ margin: '2vh 0', maxWidth: '100%' }}
                    onInput={(e) => setDescription(e.target.textContent)}
                    onBlur={(e) => setDescription(e.target.textContent)}
                  >
                    Description
                  </Typography>
                  <Stack
                    direction='column'
                    sx={{ maxHeight: '75vh', overflowY: 'auto' }}
                  >
                    {list.map(({ description, checked }, index) => (
                      <FormControlLabel
                        key={index}
                        control={<Checkbox color='success' checked={checked} />}
                        sx={{ fontSize: '2rem' }}
                        label={description}
                        onChange={(e) => {
                          const newList = [...list];
                          newList[index].checked = e.target.checked;
                          setList(newList);
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Grid container direction='row' alignItems='center'>
                  <Grid item xs={11}>
                    <TextField
                      label='New Checklist'
                      variant='outlined'
                      value={newItem}
                      onChange={({ target }) => setNewItem(target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color='success'
                      size='large'
                      onClick={addNewItem}
                    >
                      <AddTaskRounded />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid item sm={3} xs={12}>
          <Paper
            sx={{
              minHeight: '20vh',
              padding: '1vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Grid container direction='column' alignItems='center'>
              <Button
                variant='contained'
                color='success'
                sx={{ color: theme.palette.primary.light }}
              >
                Save
              </Button>
              <Typography
                variant='h4'
                color={theme.palette.primary.main}
                marginTop='2vh'
              >
                Leaving without saving will discard all unsaved changes
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default CheckListPage;
