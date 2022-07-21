import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import AuthGuard from '../../utils/AuthGuard';
import ListSection from './ListSection/ListSection';
import SaveSection from './SaveSection/SaveSection';
import UsersSection from './UsersSection/UsersSection';
import Loader from '../../components/ui/Loader';
import useAuth from '../../hooks/useAuth';

const CheckListPage = () => {
  const [title, setTitle] = useState('Title');
  const [description, setDescription] = useState('Description');
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const { createNewChecklist, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const getData = () => {};

  useEffect(() => {
    const listNo = searchParams.get('listNo');
    console.log(listNo);
  }, [searchParams]);

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
          />
        </Grid>
        <Grid item sm={2} xs={12}>
          <Grid container direction='column' gap='1vh'>
            <SaveSection
              onClick={async () => {
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
                  console.log('CheckListPage', listInfo, users);
                  setUsersList(users);
                  setTitle(listInfo.title);
                  setDescription(listInfo.description);
                  setList(JSON.parse(listInfo.checklist));
                  setSearchParams({ listNo: listInfo.id }, { replace: true });
                  setIsLoading(false);
                } catch (e) {
                  console.log(e);
                  setIsLoading(false);
                }
              }}
              disableButton={isLoading}
            />
            <UsersSection users={usersList} />
          </Grid>
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default CheckListPage;
