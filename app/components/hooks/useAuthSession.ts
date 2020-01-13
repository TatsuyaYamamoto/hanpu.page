import * as React from "react";
const { useState } = React;

import { auth, User } from "firebase/app";

const useAuthSession = () => {
  /**
   * Firebase User State
   */
  const [loginUser, setLoginUser] = useState<User | null>(null);

  const isLoggedIn: boolean = Boolean(loginUser);

  const loginWithTwitter = () => {
    const unsubscribe = auth().onAuthStateChanged(changedUser => {
      if (changedUser) {
        setLoginUser(changedUser);
        unsubscribe();
      } else {
        const provider = new auth.TwitterAuthProvider();
        auth().signInWithRedirect(provider);
      }
    });
  };

  const logout = () => {
    return auth().signOut();
  };

  return {
    loginUser,
    isLoggedIn,
    loginWithTwitter,
    logout
  };
};

export default useAuthSession;
