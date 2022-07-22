import React, { useState } from 'react';
import { Grid, Paper, Stack, TextField, IconButton } from '@mui/material';
import { AddTaskRounded } from '@mui/icons-material';

import EditableContent from '../../../components/ui/EditableContent';
import CustomCheckbox from '../../../components/ui/CustomCheckbox';
import { Timestamp } from 'firebase/firestore';

const ListSection = ({
  title,
  setTitle,
  description,
  setDescription,
  list,
  setList,
  isLoading,
}) => {
  const [newItem, setNewItem] = useState('');

  const addNewItem = () => {
    if (newItem !== '') {
      const newArray = [...list];
      newArray.push({
        checked: false,
        task: newItem,
        created: Timestamp.fromDate(new Date()),
      });
      setList(newArray);
      setNewItem('');
    }
  };
  return (
    <Grid container>
      <Paper
        sx={{
          minHeight: '95vh',
          padding: '1em',
          width: '100%',
          display: 'flex',
          wordWrap: 'break-word',
        }}
      >
        <Grid container direction='column' justifyContent='space-between'>
          <Stack direction='column'>
            <EditableContent text={title} setText={setTitle} label='Title' />
            <EditableContent
              text={description}
              setText={setDescription}
              variant='h4'
              label='Description'
            />

            <Stack
              direction='column'
              sx={{
                maxHeight: '75vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                width: '100%',
              }}
            >
              {list.map(({ task, checked, created }, index) => (
                <CustomCheckbox
                  key={index}
                  checked={checked}
                  task={task}
                  created={created}
                  index={index}
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
                label='Add To Checklist'
                variant='outlined'
                color='secondary'
                value={newItem}
                onChange={({ target }) => setNewItem(target.value)}
                fullWidth
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton color='success' size='large' onClick={addNewItem}>
                <AddTaskRounded />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ListSection;
