import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Stack,
  TextField,
  IconButton,
  Typography,
  Modal,
  Button,
} from '@mui/material';
import { AddTaskRounded, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import EditableContent from '../../../components/ui/EditableContent';
import CustomCheckbox from '../../../components/ui/CustomCheckbox';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

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
  isManager,
  deadline,
  setDeadline,
}) => {
  const [newItem, setNewItem] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const addNewItem = () => {
    if (newItem !== '' && canEdit) {
      const newList = [...list];
      newList.push({
        checked: false,
        task: newItem,
        created: Timestamp.fromDate(new Date()),
      });
      setList(newList);
      setNewItem('');
    } else {
      setShowSnackbar(true);
    }
  };

  const removeItem = (task) => {
    const newList = list.filter((l) => l.task !== task);
    setList(newList);
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
            <Grid
              container
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              gap='1em'
            >
              <Grid item flexGrow={1}>
                <EditableContent
                  text={title}
                  setText={setTitle}
                  canEdit={canEdit}
                  label='Title'
                />
              </Grid>
              <Grid item>
                {isManager && deadline === '' && (
                  <Typography
                    variant='h6'
                    onClick={() => isManager && setShowModal(true)}
                  >
                    Set Deadline
                  </Typography>
                )}
                {isManager && deadline !== '' && (
                  <Typography
                    variant='h6'
                    onClick={() => isManager && setShowModal(true)}
                  >
                    Deadline: {moment(deadline).format('h:mm a LL')}
                  </Typography>
                )}
                {!isManager && deadline !== '' && (
                  <Typography
                    variant='h6'
                    onClick={() => isManager && setShowModal(true)}
                  >
                    Deadline: {moment(deadline).format('h:mm a LL')}
                  </Typography>
                )}
                {!isManager && deadline === '' && (
                  <Typography
                    variant='h6'
                    onClick={() => isManager && setShowModal(true)}
                  >
                    No Deadline Available
                  </Typography>
                )}

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
                    <DateTimePicker
                      value={deadline}
                      label='Deadline'
                      onChange={(val) => setDeadline(val)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Paper>
                </Modal>
              </Grid>
            </Grid>
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
                  isManager={isManager}
                  removeItem={() => removeItem(task)}
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
            <Grid item flexGrow={1}>
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
            <Grid item>
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
