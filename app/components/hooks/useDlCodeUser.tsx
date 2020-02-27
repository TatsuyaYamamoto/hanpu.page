import {
  default as React,
  createContext,
  useEffect,
  useState,
  useContext
} from "react";

import { firestore } from "firebase/app";

import useFirebase from "./useFirebase";
import useAuth0, { Auth0User } from "./useAuth0";

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
    readonly auth0User: Auth0User
  ) {}

  public get uid(): string {
    return this.auth0User.sub;
  }

  /**
   * twitter api上のscreen_nameを返却する
   */
  public get displayName(): string {
    const displayName = this.auth0User.nickname;

    if (!displayName) {
      // TODO Twitterアカウントに表示名がない想定は無いが、デフォルト文字列を返却するようにする
      return "";
    }

    return displayName;
  }

  public get iconUrl(): string {
    const url = this.auth0User.picture;

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

    // (100%ではないが)型安全にネストされたオブジェクトのkeyを宣言する
    const keyElements: (
      | (keyof DlCodeUserDocument)
      | CounterType
      | (keyof Counter))[] = ["counters", counter, "limit"];
    const nestedUpdateOjectKey = keyElements.join();

    await colRef.doc(this.uid).update({
      [nestedUpdateOjectKey]: newValue
    });
  }

  public static getColRef(firestoreInstance: firestore.Firestore) {
    return firestoreInstance.collection(`users`);
  }

  public static async load(
    auth0User: Auth0User,
    firestoreInstance: firestore.Firestore
  ): Promise<DlCodeUser> {
    const uid = auth0User.sub;
    const colRef = DlCodeUser.getColRef(firestoreInstance);

    const snap = await colRef.doc(uid).get();

    if (snap.exists) {
      const doc = snap.data() as DlCodeUserDocument;
      return new DlCodeUser(doc, auth0User);
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

    return new DlCodeUser(userDoc, auth0User);
  }
}

interface IDlCodeUserContext {
  user?: DlCodeUser;
  sessionState: SessionState;
}

export const dlCodeUserContext = createContext<IDlCodeUserContext>({} as any);

export const DlCodeUserContextProvider: React.FC<{}> = props => {
  const [contextValue, setContextValue] = useState<IDlCodeUserContext>({
    sessionState: "processing"
  });
  const { app: firebaseApp } = useFirebase();
  const { initialized: isAuth0Initialized, user: auth0User } = useAuth0();

  useEffect(() => {
    if (!firebaseApp) {
      // suspend. if firebase app has not been initialized.
      return;
    }

    if (!isAuth0Initialized) {
      // suspend. if auth0 has not been initialized
      return;
    }

    if (!auth0User) {
      // currently, user is not logged-in as auth0 user.
      setContextValue(prev => ({
        ...prev,
        sessionState: "loggedOut",
        user: undefined
      }));
      return;
    }

    DlCodeUser.load(auth0User, firebaseApp.firestore()).then(dlCodeUser => {
      setContextValue(prev => ({
        ...prev,
        sessionState: "loggedIn",
        user: dlCodeUser
      }));
    });
  }, [firebaseApp, isAuth0Initialized, auth0User]);

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
