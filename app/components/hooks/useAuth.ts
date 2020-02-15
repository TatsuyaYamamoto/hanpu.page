import { useMemo } from "react";

import { User as FirebaseUser, firestore } from "firebase/app";

import useFirebase from "./useFirebase";

export class DlCodeUser {
  public constructor(readonly firebaseUser: FirebaseUser) {}

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

  public getMaxIssuableDownloadCodeCount(
    firestoreInstance: firestore.Firestore
  ): Promise<number> {
    const colRef = DlCodeUser.getColRef(firestoreInstance);

    return colRef
      .doc(``)
      .get()
      .then(snap => snap.data())
      .then(data => {
        return data ? data.maxIssuableDownloadCodeCount : undefined;
      });
  }

  public static getColRef(firestoreInstance: firestore.Firestore) {
    return firestoreInstance.collection(`users`);
  }
}

const useAuth = () => {
  const { user: firebaseUser } = useFirebase();

  const user = useMemo<DlCodeUser | null>(() => {
    if (!firebaseUser) {
      return null;
    }

    return new DlCodeUser(firebaseUser);
  }, [firebaseUser]);

  return { user };
};

export default useAuth;
