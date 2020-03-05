import * as React from "react";
const { useEffect, createContext, useContext } = React;

import {
  initializeApp,
  app as firebaseApp,
  User as FirebaseUser
} from "firebase/app";

import useAuth0 from "./useAuth0";
import configs from "../../configs";
import { useAssignableState } from "../../utils/hooks";

type FirebaseApp = firebaseApp.App;

interface IFirebaseContext {
  app?: FirebaseApp;
  user?: FirebaseUser;
  authStateChecked: boolean;
}

interface FirebaseContextProviderProps {
  initParams: { options: object; name?: string };
}

const firebaseContext = createContext<IFirebaseContext>(null as any);

const FirebaseContextProvider: React.FC<
  FirebaseContextProviderProps
> = props => {
  const [contextValue, assignContextValue] = useAssignableState<
    IFirebaseContext
  >({
    authStateChecked: false
  });
  const { initialized: isAuth0Initialized, idToken: auth0IdToken } = useAuth0();

  useEffect(() => {
    const { options, name } = props.initParams;

    const app = initializeApp(options, name);
    assignContextValue({ app });

    app.auth().onAuthStateChanged((changedUser: any) => {
      log("auth state is changed.", changedUser);

      assignContextValue({
        user: changedUser ? changedUser : undefined,
        authStateChecked: true
      });
    });
  }, []);

  useEffect(() => {
    const { app: firebaseAppInstance } = contextValue;
    if (!firebaseAppInstance) {
      return;
    }

    if (!isAuth0Initialized) {
      return;
    }

    (async () => {
      if (auth0IdToken) {
        log("sign-in to firebase app with custom token.");
        const token = await getFirebaseCustomToken(auth0IdToken);
        await firebaseAppInstance.auth().signInWithCustomToken(token);
      } else {
        log("no auth0 idToken is hold. sign out from firebase app.");
        await firebaseAppInstance.auth().signOut();
      }
    })();
  }, [contextValue, isAuth0Initialized, auth0IdToken]);

  return (
    <firebaseContext.Provider value={contextValue}>
      {props.children}
    </firebaseContext.Provider>
  );
};

const useFirebase = () => {
  const { app, user, authStateChecked } = useContext(firebaseContext);

  return {
    authStateChecked,
    app,
    user
  };
};

/**
 * @private
 * @param message
 * @param optionalParams
 */
const log = (message?: any, ...optionalParams: any[]): void => {
  // tslint:disable-next-line
  console.log(`[useFirebase] ${message}`, ...optionalParams);
};

/**
 * @private
 * @param bearerToken
 */
const getFirebaseCustomToken = async (bearerToken: string) => {
  const response = await fetch(`${configs.apiServerOrigin}/auth/token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      scope: "dl-code.web.app"
    })
  });
  if (response.ok) {
    const json = await response.json();
    return json.token;
  }
  throw new Error(await response.text());
};

export default useFirebase;
export { FirebaseContextProvider };
