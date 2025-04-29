import React, { createContext, useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { app } from '../utils/firebase';

export const AuthContext = createContext({
  user: null,
  initializing: true,
  signIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }) {
  const auth = getAuth(app);
  const [user, setUser]             = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError]           = useState(null);

  // Subscribe to auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, [auth]);

  const signIn = async (email, password) => {
    setError(null);
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will fire next and update `user`
  };

  const signUp = async (email, password) => {
    setError(null);
    await createUserWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will fire next
  };

  const logOut = async () => {
    await signOut(auth);
    // onAuthStateChanged will fire with null
  };

  return (
    <AuthContext.Provider value={{
      user,
      initializing,
      error,
      signIn,
      signUp,
      logOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
