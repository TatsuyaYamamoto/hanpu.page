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

interface Counter {
  limit: number;
  current: number;
}

type CounterType = "product" | "downloadCode" | "totalFileSizeByte";

interface DlCodeUserDocument {
  counters: { [type in CounterType]: Counter };
}

export class DlCodeUser {
  public constructor(
    readonly user: DlCodeUserDocument,
    readonly firebaseUser: FirebaseUser
  ) {}

  public get uid(): string {
    return this.firebaseUser.uid;
  }

  /**
   * twitter api上のscreen_nameを返却する
   */
  public get twitterUserName(): string {
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

  public async editCounter(
    counter: CounterType,
    newValue: number,
    firestoreInstance: firestore.Firestore
  ) {
    const { limit } = this.user.counters[counter];

    if (limit < newValue) {
      throw new Error(`Exceeded limit. limit: ${limit}, new : ${newValue}`);
    }

    const colRef = DlCodeUser.getColRef(firestoreInstance);
    const { uid } = this.firebaseUser;

    // (100%ではないが)型安全にネストされたオブジェクトのkeyを宣言する
    const keyElements: (
      | (keyof DlCodeUserDocument)
      | CounterType
      | (keyof Counter))[] = ["counters", counter, "limit"];
    const nestedUpdateOjectKey = keyElements.join();

    await colRef.doc(uid).update({
      [nestedUpdateOjectKey]: newValue
    });
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
      counters: {
        product: { limit: 1, current: 0 },
        downloadCode: { limit: 10, current: 0 },
        totalFileSizeByte: { limit: 10, current: 0 }
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
