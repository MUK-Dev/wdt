import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Grid, Snackbar } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Close } from '@mui/icons-material';

import AuthGuard from '../../utils/AuthGuard';
import ListSection from './ListSection/ListSection';
import SaveSection from './SaveSection/SaveSection';
import UsersSection from './UsersSection/UsersSection';
import Loader from '../../components/ui/Loader';
import useAuth from '../../hooks/useAuth';
import ShareSection from './ShareSection/ShareSection';
import Modal from '../../components/ui/Modal';

const CheckListPage = () => {
  const [title, setTitle] = useState('Title');
  const [description, setDescription] = useState('Description');
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { createNewChecklist, user, getList, updateChecklist } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [url, setUrl] = useState(`${window.location.href}`);
  const [canEdit, setCanEdit] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const listNo = searchParams.get('listNo');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [changeDone, setChangeDone] = useState(false);
  const firstUpdate = useRef(true);
  const secondUpdate = useRef(true);
  const thirdUpdate = useRef(true);

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
    if (thirdUpdate.current) {
      thirdUpdate.current = false;
      return;
    }
    setChangeDone(true);
  }, [title, description, list]);

  const getData = async () => {
    if (listNo) {
      setIsLoading(true);
      try {
        const { listInfo, users } = await getList(listNo);
        setUsersList(users);
        setTitle(listInfo.title);
        setDescription(listInfo.description);
        setList(listInfo.checklist);
        setSearchParams({ listNo: listInfo.id }, { replace: true });
        setIsLoading(false);
        setCanEdit(
          users.filter((u) => {
            if (u.role === 0 || u.role === 2) return u.uid === user.id;
          }).length > 0
        );
        setIsManager(
          users.filter((u) => {
            if (u.role === 0) return u.uid === user.id;
          }).length > 0
        );
        setShowModal(!(users.filter((u) => u.name === user.name).length > 0));
      } catch (e) {
        setIsLoading(false);
      }
    }
  };

  const createNewList = async () => {
    setIsLoading(true);
    try {
      const { listInfo, users } = await createNewChecklist(
        title,
        description,
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
      await updateChecklist(listNo, title, description, list);
      setChangeDone(false);
      setIsLoading(false);
    } catch (e) {
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
          />
        )}
      </AnimatePresence>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        message="You don't have access to edit this list"
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
        gap='1vh'
      >
        <Grid item sm={6} xs={12}>
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
          />
        </Grid>
        <Grid item sm={2} xs={12}>
          <Grid
            container
            direction='column'
            justifyContent='space-between'
            minHeight='95vh'
          >
            <Grid item xs={1}>
              <SaveSection
                onClick={listNo ? updateList : createNewList}
                changeDone={changeDone}
              />
            </Grid>
            <Grid item xs={1}>
              <ShareSection url={url} />
            </Grid>
            <Grid item xs={10}>
              <UsersSection
                users={usersList}
                isManager={isManager}
                setIsLoading={setIsLoading}
                setUsers={setUsersList}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default CheckListPage;
