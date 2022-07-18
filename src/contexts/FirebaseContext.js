import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';

// third-party
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { doc, setDoc, getFirestore, getDoc } from 'firebase/firestore';

// action - state management
import { LOGIN, LOGOUT } from '../store/actions';
import accountReducer from '../store/accountReducer';

// project imports
import Loader from '../components/ui/Loader';
import { FIREBASE_API } from '../config';

let app, db;
// firebase initialize
if (!firebase.apps.length) {
  app = firebase.initializeApp(FIREBASE_API);
  db = getFirestore(app);
}

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
    });
    return user;
  };

  const firebaseGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const auth = await firebase.auth().signInWithPopup(provider);
    const uid = firebase.auth().currentUser?.uid;
    if (uid) {
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
    setUserInfo({ fname, lname, avatar: avatar_url, company: company ?? '' });
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
