import * as React from "react";
const { useState, useEffect } = React;

import { auth, User } from "firebase/app";

const useAuthSession = () => {
  /**
   * Firebase User State
   */
  const [user, setUser] = useState<User | null>(null);

  const isLoggedIn = Boolean(user);

  const loginWithTwitter = () => {
    const provider = new auth.TwitterAuthProvider();
    return auth().signInWithRedirect(provider);
  };

  const logout = () => {
    return auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(changedUser => {
      setUser(changedUser);

      // tslint:disable-next-line:no-console
      console.log(`${!!changedUser ? "logged-in" : "logged-out"}`, changedUser);
    });

    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return {
    user,
    isLoggedIn,
    loginWithTwitter,
    logout
  };
};

export default useAuthSession;
