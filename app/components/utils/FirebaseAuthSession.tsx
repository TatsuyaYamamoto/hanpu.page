import * as React from "react";

import { auth, User } from "firebase/app";

interface FirebaseAuthSessionContextType {
  user: User | null;
  loginWithTwitter: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseAuthSessionContext = React.createContext<
  FirebaseAuthSessionContextType
>(undefined /* TODO: check required value */);

const FirebaseAuthSession: React.FC = props => {
  const { children } = props;

  /**
   * Firebase User State
   */
  const [user, setUser] = React.useState<User | null>(null);

  /**
   * Twitterアカウントでログインを実行する
   */
  const loginWithTwitter = () => {
    const provider = new auth.TwitterAuthProvider();
    return auth().signInWithRedirect(provider);
  };

  /**
   * ログアウト
   */
  const logout = () => {
    return auth().signOut();
  };

  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(changedUser => {
      setUser(changedUser);

      // tslint:disable-next-line:no-console
      console.log(`${!!user ? "logged-in" : "logged-out"}`, changedUser);
    });

    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return (
    <FirebaseAuthSessionContext.Provider
      value={{
        user,
        loginWithTwitter,
        logout
      }}
    >
      {children}
    </FirebaseAuthSessionContext.Provider>
  );
};

export default FirebaseAuthSession;
export { FirebaseAuthSessionContext, FirebaseAuthSessionContextType };
