import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import AuthGuard from '../../utils/AuthGuard';
import ListSection from './ListSection/ListSection';
import SaveSection from './SaveSection/SaveSection';
import UsersSection from './UsersSection/UsersSection';
import Loader from '../../components/ui/Loader';
import useAuth from '../../hooks/useAuth';
import ShareSection from './ShareSection/ShareSection';

const CheckListPage = () => {
  const [title, setTitle] = useState('Title');
  const [description, setDescription] = useState('Description');
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const { createNewChecklist, user, getList, updateChecklist } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const listNo = searchParams.get('listNo');

  const getData = async () => {
    if (listNo) {
      setIsLoading(true);
      try {
        const { listInfo, users } = await getList(listNo);
        setUsersList(users);
        setTitle(listInfo.title);
        setDescription(listInfo.description);
        setList(JSON.parse(listInfo.checklist));
        setSearchParams({ listNo: listInfo.id }, { replace: true });
        setIsLoading(false);
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
        user.name,
        user.avatar,
        0
      );
      setUsersList(users);
      setTitle(listInfo.title);
      setDescription(listInfo.description);
      setList(JSON.parse(listInfo.checklist));
      setSearchParams({ listNo: listInfo.id }, { replace: true });
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
      console.log(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    if (usersList.filter((u) => u.name === user.name)) {
      console.log('User Not in List');
    }
  }, []);

  return (
    <AuthGuard>
      {isLoading && <Loader />}
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
            <ShareSection />
            <UsersSection users={usersList} />
          </Grid>
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default CheckListPage;
