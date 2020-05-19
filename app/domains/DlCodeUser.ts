import { firestore } from "firebase/app";

import { Auth0User } from "../components/hooks/useAuth0";

export interface Counter {
  limit: number;
  current: number;
}

export type CounterType = "product" | "downloadCode" | "totalFileSizeByte";

export interface DlCodeUserDocument {
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
      | keyof DlCodeUserDocument
      | CounterType
      | keyof Counter
    )[] = ["counters", counter, "current"];
    const nestedUpdateObjectKey = keyElements.join(".");

    return colRef.doc(this.uid).update({
      [nestedUpdateObjectKey]: newValue
    });
  }

  public static getColRef(firestoreInstance: firestore.Firestore) {
    return firestoreInstance.collection(`users`);
  }
}
