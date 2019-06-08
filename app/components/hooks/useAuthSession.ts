import * as React from "react";
const { useState, useEffect } = React;

import { auth, User } from "firebase/app";

const useAuthSession = () => {
  /**
   * Firebase User State
   */
  const [loginUser, setLoginUser] = useState<User | null>(null);

  const [loginCheckState, setLoginCheckState] = useState<
    "inProgress" | "completed"
  >("inProgress");

  const isLoggedIn: boolean = Boolean(loginUser);

  const loginWithTwitter = () => {
    const provider = new auth.TwitterAuthProvider();
    return auth().signInWithRedirect(provider);
  };

  const logout = () => {
    return auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(changedUser => {
      setLoginUser(changedUser);
      setLoginCheckState("completed");
    });

    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return {
    loginUser,
    loginCheckState,
    isLoggedIn,
    loginWithTwitter,
    logout
  };
};

export default useAuthSession;
