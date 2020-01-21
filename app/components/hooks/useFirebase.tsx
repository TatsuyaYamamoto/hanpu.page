import * as React from "react";
const { useEffect, useState, createContext, useContext } = React;

import {
  initializeApp,
  app as firebaseApp,
  auth as firebaseAuth,
  User as FirebaseUser
} from "firebase/app";
type FirebaseApp = firebaseApp.App;

interface IFirebaseContext {
  app?: FirebaseApp;
  user?: FirebaseUser;
  initialized: boolean;
  authStateChecked: boolean;
}

interface FirebaseContextProviderProps {
  initParams: { options: object; name?: string };
}

const firebaseContext = createContext<IFirebaseContext>(null as any);

const FirebaseContextProvider: React.FC<
  FirebaseContextProviderProps
> = props => {
  const [contextValue, setContextValue] = useState<IFirebaseContext>({
    initialized: false,
    authStateChecked: false
  });

  useEffect(() => {
    const { options, name } = props.initParams;
    const app = initializeApp(options, name);

    setContextValue(prev => ({
      ...prev,
      app,
      initialized: true
    }));

    app.auth().onAuthStateChanged(changedUser => {
      setContextValue(prev => ({
        ...prev,
        user: changedUser ? changedUser : undefined,
        authStateChecked: true
      }));
    });
  }, []);

  return (
    <firebaseContext.Provider value={contextValue}>
      {props.children}
    </firebaseContext.Provider>
  );
};

const useFirebase = () => {
  const { app, user, initialized, authStateChecked } = useContext(
    firebaseContext
  );

  const loginWithTwitter = async () => {
    if (!app) {
      // TODO
      // prettier-ignore
      // tslint:disable-next-line
      console.info("login processing was interrupted because FirebaseApp has not been initialized.");
      return;
    }

    const provider = new firebaseAuth.TwitterAuthProvider();
    await app.auth().signInWithRedirect(provider);
  };

  const logout = async () => {
    if (!app) {
      // TODO
      // prettier-ignore
      // tslint:disable-next-line
      console.info("logout processing was interrupted because FirebaseApp has not been initialized.");
      return;
    }

    return app.auth().signOut();
  };

  return {
    initialized,
    authStateChecked,
    app,
    user,
    loginWithTwitter,
    logout
  };
};

export default useFirebase;
export { FirebaseContextProvider };
