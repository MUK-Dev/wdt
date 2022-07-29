import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Grid, Snackbar } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Close } from '@mui/icons-material';
import moment from 'moment';

import AuthGuard from '../../utils/AuthGuard';
import ListSection from './ListSection/ListSection';
import SaveSection from './SaveSection/SaveSection';
import UsersSection from './UsersSection/UsersSection';
import Loader from '../../components/ui/Loader';
import useFirebase from '../../hooks/useFirebase';
import ShareSection from './ShareSection/ShareSection';
import Modal from '../../components/ui/Modal';
import { disableButton } from '../../utils/disable-button';

const CheckListPage = () => {
  const [title, setTitle] = useState('Title');
  const [searchParams, setSearchParams] = useSearchParams();
  const listNo = searchParams.get('listNo');
  const [description, setDescription] = useState('Description');
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const {
    createNewChecklist,
    user,
    getList,
    updateChecklist,
    showNotificationSnackbar,
    setShowNotificationSnackbar,
    snackbarNotification,
  } = useFirebase();
  const [url, setUrl] = useState(`${window.location.href}`);
  const [isManager, setIsManager] = useState(false);
  const [canEdit, setCanEdit] = useState(listNo ? false : true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [changeDone, setChangeDone] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [snackbarText, setSnackbarText] = useState(
    'You do not have access to edit this list'
  );
  const firstUpdate = useRef(true);
  const secondUpdate = useRef(true);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    //Enables save button when any value changes
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (secondUpdate.current) {
      secondUpdate.current = false;
      return;
    }
    setChangeDone(true);
  }, [title, description, list, deadline]);

  const getData = async () => {
    if (listNo) {
      setIsLoading(true);
      try {
        const { listInfo, users } = await getList(listNo);
        setUsersList(users);
        setTitle(listInfo.title);
        setDescription(listInfo.description);
        setList(listInfo.checklist);
        const gotDeadline = listInfo.deadline
          ? JSON.parse(listInfo.deadline)
          : '';
        setDeadline(listInfo.deadline ? JSON.parse(listInfo.deadline) : '');
        setSearchParams({ listNo: listInfo.id }, { replace: true });
        setIsLoading(false);
        const managerListLength = users.filter((u) => {
          if (u.role === 0) return u.uid === user.id;
          return;
        }).length;
        setIsManager(managerListLength > 0);
        if (!(managerListLength > 0)) {
          if (gotDeadline === '' || moment(gotDeadline) > moment()) {
            console.log(gotDeadline);
            setCanEdit(
              users.filter((u) => {
                if (u.role === 2) return u.uid === user.id;
                return;
              }).length > 0
            );
          } else {
            setSnackbarText('Deadline is crossed');
            setCanEdit(false);
          }
        } else {
          setCanEdit(true);
        }
        setShowModal(!(users.filter((u) => u.name === user.name).length > 0));
      } catch (e) {
        setIsLoading(false);
      }
    } else {
      setIsManager(true);
      setCanEdit(true);
    }
  };

  const createNewList = async () => {
    setIsLoading(true);
    try {
      const { listInfo, users } = await createNewChecklist(
        title,
        description,
        deadline,
        list,
        user.id,
        user.name,
        user.avatar,
        0
      );
      setUsersList(users);
      setTitle(listInfo.title);
      setDescription(listInfo.description);
      setList(listInfo.checklist);

      setDeadline(listInfo.deadline ? JSON.parse(listInfo.deadline) : '');
      setSearchParams({ listNo: listInfo.id }, { replace: true });
      setUrl(`${url}?listNo=${listInfo.id}`);
      setChangeDone(false);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const updateList = async () => {
    setIsLoading(true);
    try {
      await updateChecklist(listNo, title, deadline, description, list);
      setChangeDone(false);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      {isLoading && <Loader />}
      <AnimatePresence>
        {showModal && (
          <Modal
            setShowModal={setShowModal}
            usersList={usersList}
            setUsersList={setUsersList}
            listNo={listNo}
            roomTitle={title}
          />
        )}
      </AnimatePresence>
      <Snackbar
        open={showNotificationSnackbar}
        message={snackbarNotification}
        action={
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={() => setShowNotificationSnackbar(false)}
          >
            <Close fontSize='small' />
          </IconButton>
        }
      />
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        message={snackbarText}
        action={
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={() => setShowSnackbar(false)}
          >
            <Close fontSize='small' />
          </IconButton>
        }
      />
      <Grid
        container
        direction='row'
        justifyContent='center'
        sx={{ padding: '1em' }}
        gap='1em'
      >
        <Grid item sm={9} xs={12}>
          <ListSection
            title={title}
            setTitle={setTitle}
            description={description}
            canEdit={canEdit}
            setShowSnackbar={setShowSnackbar}
            setDescription={setDescription}
            list={list}
            setList={setList}
            isLoading={isLoading}
            isManager={isManager}
            deadline={deadline}
            setDeadline={setDeadline}
          />
        </Grid>
        <Grid item sm={2} xs={12}>
          <Grid
            container
            direction='column'
            gap='1em'
            height='95vh'
            justifyContent='space-between'
            flexWrap='nowrap'
          >
            <Grid item>
              <SaveSection
                onClick={listNo ? updateList : createNewList}
                disableButton={disableButton(isLoading, changeDone, canEdit)}
                changeDone={changeDone}
              />
            </Grid>
            <Grid item>
              <ShareSection url={url} />
            </Grid>
            <Grid item flexGrow={1} overflow='auto'>
              <UsersSection
                users={usersList}
                isManager={isManager}
                setIsLoading={setIsLoading}
                setUsers={setUsersList}
                roomTitle={title}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default CheckListPage;
