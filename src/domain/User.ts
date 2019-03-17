import { firestore, storage, auth } from "firebase/app";
import FieldValue = firestore.FieldValue;
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;
import CollectionReference = firestore.CollectionReference;
import StorageReference = storage.Reference;

/**
 * omake.pageが管理するユーザー
 *
 * UIDはFirebaseAuthenticationが採番したuidを使用する
 *
 * Roleの定義はないが、Userには二つの役割がある
 * - Provider
 *     - Omakeを登録し、配布するUser
 * - Receiver
 *     - ActivationCodeでOmakeを登録し、ダウンロードするUser
 *
 */
interface UserDocument extends DocumentData {
  /**
   * アイコン画像
   */
  iconImageRef: StorageReference;

  /**
   * ActivateしたOmakeのRefリスト
   */
  activatedOmakeRefs: {
    [omakeId: string]: DocumentReference;
  };

  /**
   * PublishしたOmakeのRefリスト
   */
  publishedOmakeRefs: {
    [omakeId: string]: DocumentReference;
  };

  /**
   * 作成日
   */
  createdAt: FieldValue | Date;

  /**
   * 更新日
   */
  updatedAt: FieldValue | Date;
}

class User implements UserDocument {
  /**
   * Return CollectionReference
   */
  public static getColRef(): CollectionReference {
    return firestore().collection("users");
  }

  public static getOwn(): DocumentReference {
    const currentUser = auth().currentUser;
    return User.getColRef().doc(currentUser.uid);
  }

  public constructor(
    readonly name: string,
    readonly description: string,
    readonly iconImageRef: StorageReference,
    readonly activatedOmakeRefs: {
      [omakeId: string]: DocumentReference;
    },
    readonly publishedOmakeRefs: {
      [omakeId: string]: DocumentReference;
    },
    readonly createdAt: FieldValue | Date,
    readonly updatedAt: FieldValue | Date
  ) {}
}

export { User, UserDocument };
