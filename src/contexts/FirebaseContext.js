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
  where,
} from 'firebase/firestore';

// action - state management
import { LOGIN, LOGOUT } from '../store/actions';
import accountReducer from '../store/accountReducer';

// project imports
import Loader from '../components/ui/Loader';
import { FIREBASE_API } from '../config';

let app, db;

app = firebase.initializeApp(FIREBASE_API);
db = getFirestore(app);

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
  const [userInfo, setUserInfo] = useState({
    fname: '',
    lname: '',
    company: '',
    avatar: '',
    verified: false,
  });

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user?.providerData[0].providerId === 'google.com') {
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: user.uid,
                email: user.email,
                name: user.displayName,
                company: userInfo.company,
                avatar: user.photoURL,
                verified: user.emailVerified ?? false,
              },
            },
          });
        } else if (user?.providerData[0].providerId === 'password') {
          const uInfo = await getDoc(doc(db, 'profiles', user.uid));
          const userInfo = uInfo.data();
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: user.uid,
                email: user.email,
                name: `${userInfo.fname} ${userInfo.lname}`,
                company: userInfo.company,
                avatar: userInfo.avatar_url,
                verified: user.emailVerified ?? false,
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

  const firebaseEmailPasswordSignIn = async (email, password) => {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const uInfo = await getDoc(doc(db, 'profiles', user.user.uid));
    const userInfo = uInfo.data();
    setUserInfo({
      fname: userInfo.fname,
      lname: userInfo.lname,
      company: userInfo.company,
      avatar: userInfo.avatar_url,
      verified: user.user.emailVerified,
    });
    return user;
  };

  const createNewChecklist = async (
    title,
    description,
    checklist,
    name,
    avatar,
    role
  ) => {
    const newList = {
      title,
      description,
      createdBy: name,
      checklist: JSON.stringify(checklist),
      created: new Date(),
    };
    const newUser = {
      name,
      avatar,
      role,
    };
    const listRef = await addDoc(collection(db, 'lists'), newList);
    await addDoc(collection(db, 'lists', listRef.id, 'users'), newUser);
    const listInfo = await getDoc(doc(db, 'lists', listRef.id));
    const usersInfo = await getDocs(
      query(collection(db, 'lists', listRef.id, 'users'))
    );
    const users = usersInfo.docs.map((u) => u.data());
    return { listInfo: { ...listInfo.data(), id: listInfo.id }, users };
  };

  const updateChecklist = (id, title, description, checklist) =>
    updateDoc(doc(db, 'lists', id), {
      title,
      description,
      checklist: JSON.stringify(checklist),
    });

  const getUserLists = async (name) => {
    const l = await getDocs(
      query(collection(db, 'lists'), where('createdBy', '==', name))
    );
    const lists = [];
    l.docs.map((list) => lists.push({ ...list.data(), id: list.id }));
    return lists;
  };

  const getList = async (listId) => {
    const listInfo = await getDoc(doc(db, 'lists', listId));
    const usersInfo = await getDocs(
      query(collection(db, 'lists', listInfo.id, 'users'))
    );
    const users = usersInfo.docs.map((u) => u.data());
    return { listInfo: { ...listInfo.data(), id: listInfo.id }, users };
  };

  const firebaseGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const auth = await firebase.auth().signInWithPopup(provider);
    const uid = firebase.auth().currentUser?.uid;
    const uInfo = await getDoc(doc(db, 'profiles', uid));
    if (uid && !uInfo.exists) {
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
    const verified = firebase.auth().currentUser.emailVerified;
    const avatar_url = `https://avatars.dicebear.com/api/bottts/:${uid}.svg`;
    const profile = {
      created: new Date(),
      avatar_url,
      fname,
      lname,
      company: company ?? '',
    };
    await setDoc(doc(db, 'profiles', uid), profile);
    setUserInfo({
      fname,
      lname,
      avatar: avatar_url,
      company: company ?? '',
      verified,
    });
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
