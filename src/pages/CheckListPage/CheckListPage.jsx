import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

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
  const listNo = searchParams.get('listNo');

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
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const updateList = async () => {
    setIsLoading(true);
    try {
      await updateChecklist(listNo, title, description, list);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
            setDescription={setDescription}
            list={list}
            setList={setList}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item sm={2} xs={12}>
          <Grid container direction='column' gap='1vh'>
            <SaveSection
              onClick={listNo ? updateList : createNewList}
              disableButton={isLoading}
            />
            <ShareSection url={url} />
            <UsersSection users={usersList} />
          </Grid>
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default CheckListPage;
