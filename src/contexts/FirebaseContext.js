import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';

// third-party
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  updateDoc,
  Timestamp,
  onSnapshot,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';

// action - state management
import { LOGIN, LOGOUT } from '../store/actions';
import accountReducer from '../store/accountReducer';

// project imports
import Loader from '../components/ui/Loader';
import { FIREBASE_API } from '../config';

export const app = firebase.initializeApp(FIREBASE_API);
export const db = getFirestore(app);

// const
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
};

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [showNotificationSnackbar, setShowNotificationSnackbar] =
    useState(false);
  const [snackbarNotification, setSnackbarNotification] = useState('');

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user?.providerData[0].providerId === 'google.com') {
          const uInfo = await getDoc(doc(db, 'profiles', user.uid));
          const userI = uInfo.data();
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: user.uid,
                email: user.email,
                name: user.displayName,
                company: userI?.company,
                avatar: user.photoURL,
                verified: user.emailVerified ?? false,
                provider: 'google',
              },
            },
          });
        } else if (user?.providerData[0].providerId === 'password') {
          const uInfo = await getDoc(doc(db, 'profiles', user.uid));
          const userI = uInfo.data();
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: user.uid,
                email: user.email,
                name: `${userI.fname} ${userI.lname}`,
                fname: userI.fname,
                lname: userI.lname,
                company: userI.company,
                avatar: userI.avatar_url,
                verified: user.emailVerified ?? false,
                provider: 'password',
              },
            },
          });
        } else {
          dispatch({
            type: LOGOUT,
          });
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  useEffect(() => {
    setNotificationLoading(true);
    if (state.user?.id) {
      onSnapshot(
        query(
          collection(db, 'notifications'),
          where('reciever', '==', state.user.id),
          orderBy('created', 'desc')
        ),
        (querySnapshot) => {
          const n = [];
          querySnapshot.docs.slice(0, 10).forEach((doc) => n.push(doc.data()));
          if (querySnapshot.size > 10) {
            querySnapshot.docs
              .slice(10, querySnapshot.size)
              .forEach(
                async (d) => await deleteDoc(doc(db, 'notifications', d.id))
              );
          }

          setNotifications(n);
          setShowNotificationSnackbar(false);
          setNotificationLoading(false);
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              setSnackbarNotification(change.doc.data().message);
              setShowNotificationSnackbar(true);
            }
          });
        },
        (err) => {
          console.log(err);
          setNotificationLoading(false);
        }
      );
    }
  }, [state.user]);

  const firebaseEmailPasswordSignIn = async (email, password) => {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return user;
  };

  const updateUserInfo = async (uid, fname, lname, company, provider) => {
    if (provider === 'google') {
      await updateDoc(doc(db, 'profiles', uid), {
        company,
      });
    } else if (provider === 'password') {
      await updateDoc(doc(db, 'profiles', uid), {
        fname,
        lname,
        company,
      });
      const l = await getDocs(query(collection(db, 'lists')));
      l.docs.map(async (list) => {
        if (list.data().users?.filter((u) => u.uid === uid).length > 0) {
          const newList = [...list.data().users];
          for (let i in newList) {
            if (newList[i].uid === uid) newList[i].name = `${fname} ${lname}`;
          }
          await updateDoc(doc(db, 'lists', list.id), {
            users: newList,
          });
        }
      });
    }
  };

  const createNewChecklist = async (
    title,
    description,
    deadline,
    checklist,
    uid,
    name,
    avatar,
    role
  ) => {
    const newUser = {
      uid,
      name,
      avatar,
      role,
    };
    const newList = {
      title,
      description,
      deadline: JSON.stringify(deadline),
      createdBy: uid,
      checklist: checklist,
      users: [newUser],
      created: new Date(),
    };
    const listRef = await addDoc(collection(db, 'lists'), newList);
    const listInfo = await getDoc(doc(db, 'lists', listRef.id));
    return {
      listInfo: { ...listInfo.data(), id: listInfo.id },
      users: listInfo.data().users,
    };
  };

  const updateChecklist = (id, title, deadline, description, checklist) =>
    updateDoc(doc(db, 'lists', id), {
      title,
      description,
      deadline: JSON.stringify(deadline),
      checklist: checklist,
    });

  const promoteUser = async (listId, users, index, toRole) => {
    const newList = [...users];
    newList[index].role = toRole;
    await updateDoc(doc(db, 'lists', listId), {
      users: newList,
    });
  };

  const getUserLists = async (id) => {
    const l = await getDocs(query(collection(db, 'lists')));

    const lists = [];
    l.docs.forEach((list) => {
      if (list.data().users?.filter((u) => u.uid === id).length > 0)
        lists.push({ ...list.data(), id: list.id });
    });
    return lists;
  };

  const getList = async (listId) => {
    const listInfo = await getDoc(doc(db, 'lists', listId));

    return {
      listInfo: { ...listInfo.data(), id: listInfo.id },
      users: listInfo.data().users,
    };
  };

  const createNotification = async (reciever, message, roomTitle) => {
    const newNotification = {
      reciever,
      message,
      roomTitle,
      created: Timestamp.fromDate(new Date()),
    };
    await addDoc(collection(db, 'notifications'), newNotification);
  };

  const exitList = async (listId, uid) => {
    const listInfo = await getDoc(doc(db, 'lists', listId));
    const newList = listInfo.data().users.filter((u) => u.uid !== uid);
    await updateDoc(doc(db, 'lists', listId), {
      users: newList,
    });
  };

  const requestAccessToList = async (
    listId,
    prevUsers,
    uid,
    name,
    avatar,
    role
  ) => {
    const user = {
      uid,
      name,
      avatar,
      role,
    };
    await updateDoc(doc(db, 'lists', listId), {
      users: [...prevUsers, user],
    });
  };

  const firebaseGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const auth = await firebase.auth().signInWithPopup(provider);
    const uid = firebase.auth().currentUser?.uid;
    const uInfo = await getDoc(doc(db, 'profiles', uid));
    if (!!!uInfo.data()) {
      const profile = {
        created: new Date(),
        company: '',
      };
      await setDoc(doc(db, 'profiles', uid), profile);
    }
    return auth;
  };

  const firebaseRegister = async (email, fname, lname, company, password) => {
    const auth = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    auth.user.sendEmailVerification();
    const uid = firebase.auth().currentUser.uid;
    const avatar_url = `https://avatars.dicebear.com/api/bottts/:${uid}.svg`;
    const profile = {
      created: new Date(),
      avatar_url,
      fname,
      lname,
      company: company ?? '',
    };
    await setDoc(doc(db, 'profiles', uid), profile);

    return auth;
  };

  const logout = () => firebase.auth().signOut();

  const resetPassword = async (email) => {
    await firebase.auth().sendPasswordResetEmail(email);
  };

  const updateProfile = () => {};
  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <FirebaseContext.Provider
      value={{
        ...state,
        firebaseRegister,
        firebaseEmailPasswordSignIn,
        login: () => {},
        firebaseGoogleSignIn,
        logout,
        resetPassword,
        updateProfile,
        createNewChecklist,
        getUserLists,
        getList,
        updateChecklist,
        requestAccessToList,
        promoteUser,
        exitList,
        createNotification,
        notifications,
        notificationLoading,
        showNotificationSnackbar,
        setShowNotificationSnackbar,
        snackbarNotification,
        updateUserInfo,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

FirebaseProvider.propTypes = {
  children: PropTypes.node,
};

export default FirebaseContext;
