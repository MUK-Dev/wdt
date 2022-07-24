import React, { useState } from 'react';
import { Grid, Paper, Stack, TextField, IconButton } from '@mui/material';
import { AddTaskRounded, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

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
  canEdit,
  setShowSnackbar,
}) => {
  const [newItem, setNewItem] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const addNewItem = () => {
    if (newItem !== '' && canEdit) {
      const newArray = [...list];
      newArray.push({
        checked: false,
        task: newItem,
        created: Timestamp.fromDate(new Date()),
      });
      setList(newArray);
      setNewItem('');
    } else {
      setShowSnackbar(true);
    }
  };
  return (
    <Grid container>
      <Paper
        sx={{
          minHeight: '95vh',
          padding: '1.5em 1em 1em 1em',
          width: '100%',
          display: 'flex',
          wordWrap: 'break-word',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: -12,
            left: -12,
            backgroundColor: theme.palette.success.main,
            '&:hover': {
              backgroundColor: theme.palette.success.main,
            },
          }}
          edge='end'
          onClick={() => navigate('/home', { replace: true })}
        >
          <ArrowBack htmlColor={theme.palette.primary.light} />
        </IconButton>
        <Grid container direction='column' justifyContent='space-between'>
          <Stack direction='column'>
            <EditableContent
              text={title}
              setText={setTitle}
              canEdit={canEdit}
              label='Title'
            />
            <EditableContent
              text={description}
              setText={setDescription}
              canEdit={canEdit}
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
                    if (canEdit) {
                      const newList = [...list];
                      newList[index].checked = e.target.checked;
                      setList(newList);
                    } else {
                      setShowSnackbar(true);
                    }
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
                disabled={isLoading || !canEdit}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                color='success'
                size='large'
                onClick={addNewItem}
                disabled={isLoading || !canEdit}
              >
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
