import {
  default as React,
  createContext,
  useEffect,
  useState,
  useContext
} from "react";

import { User as FirebaseUser, firestore } from "firebase/app";

import useFirebase from "./useFirebase";

export type SessionState = "processing" | "loggedIn" | "loggedOut";

interface DlCodeUserDocument {
  limit: {
    issuableDownloadCodeCount: number;
  };
}

export class DlCodeUser {
  public constructor(
    readonly user: DlCodeUserDocument,
    readonly firebaseUser: FirebaseUser
  ) {}

  public get name(): string {
    const displayName = this.firebaseUser.displayName;

    if (!displayName) {
      // TODO Twitterアカウントに表示名がない想定は無いが、デフォルト文字列を返却するようにする
      return "";
    }

    return displayName;
  }

  public get iconUrl(): string {
    const url = this.firebaseUser.photoURL;

    if (!url) {
      // TODO Twitterアカウントにアイコンがない想定は無いが、デフォルト画像のURLを返却するようにする
      return "";
    }

    // https://developer.twitter.com/en/docs/accounts-and-users/user-profile-images-and-banners
    return url.replace("normal", "bigger");
  }

  public get maxIssuableDownloadCodeCount() {
    return this.user.limit.issuableDownloadCodeCount;
  }

  public static getColRef(firestoreInstance: firestore.Firestore) {
    return firestoreInstance.collection(`users`);
  }

  public static async load(
    firebaseUser: FirebaseUser,
    firestoreInstance: firestore.Firestore
  ): Promise<DlCodeUser> {
    const { uid } = firebaseUser;
    const colRef = DlCodeUser.getColRef(firestoreInstance);

    const snap = await colRef.doc(uid).get();

    if (snap.exists) {
      const doc = snap.data() as DlCodeUserDocument;
      return new DlCodeUser(doc, firebaseUser);
    }

    // TODO avoid hard coding of initial params
    const userDoc: DlCodeUserDocument = {
      limit: {
        issuableDownloadCodeCount: 10
      }
    };
    await colRef.doc(uid).set(userDoc);

    return new DlCodeUser(userDoc, firebaseUser);
  }
}

interface IDlCodeUserContext {
  user?: DlCodeUser;
  sessionState: SessionState;
}

export const dlCodeUserContext = createContext<IDlCodeUserContext>(null as any);

export const DlCodeUserContextProvider: React.FC<{}> = props => {
  const [contextValue, setContextValue] = useState<IDlCodeUserContext>({
    sessionState: "processing"
  });
  const {
    user: firebaseUser,
    app: firebaseApp,
    authStateChecked
  } = useFirebase();

  useEffect(() => {
    if (!firebaseApp) {
      // firebase app has not been initialized.
      return;
    }

    if (!authStateChecked) {
      // first confirm of firebase auth login has not been initialized.
      return;
    }

    if (!firebaseUser) {
      // currently, user is not logged-in.
      setContextValue(prev => ({
        ...prev,
        sessionState: "loggedOut",
        user: undefined
      }));
      return;
    }

    DlCodeUser.load(firebaseUser, firebaseApp.firestore()).then(dlCodeUser => {
      setContextValue(prev => ({
        ...prev,
        sessionState: "loggedIn",
        user: dlCodeUser
      }));
    });
  }, [firebaseApp, authStateChecked, firebaseUser]);

  return (
    <dlCodeUserContext.Provider value={contextValue}>
      {props.children}
    </dlCodeUserContext.Provider>
  );
};

const useDlCodeUser = () => {
  const { user, sessionState } = useContext(dlCodeUserContext);

  return { user, sessionState };
};

export default useDlCodeUser;
