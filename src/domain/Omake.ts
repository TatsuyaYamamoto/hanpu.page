import { firestore, storage } from "firebase/app";
import CollectionReference = firestore.CollectionReference;
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;
import FieldValue = firestore.FieldValue;
import StorageReference = storage.Reference;

import { User } from "./User";
import { ActivationCode } from "./ActivationCode";

export type PublishState = "publish" | "private";

interface OmakeDocument extends DocumentData {
  /**
   * Omakeの名前
   */
  name: string;

  /**
   * Omakeの説明
   */
  description: string;

  /**
   * Omakeのサムネ画像Ref
   */
  imageRef: StorageReference | null;

  /**
   * Omakeを配布するUser(Provider)DocRef
   */
  providerRef: DocumentReference;

  /**
   * Omakeに紐づけたActivationCode
   */
  activationCodeRef: DocumentReference;

  /**
   * Omakeに紐づけたItemのRefリスト
   */
  itemRefs: {
    [omakeItemId: string]: DocumentReference;
  };

  /**
   * Omakeの公開状態
   */
  state: PublishState;

  /**
   * 作成日
   */
  createdAt: FieldValue | Date;

  /**
   * 更新日
   */
  updatedAt: FieldValue | Date;
}

class Omake implements OmakeDocument {
  public static getColRef(): CollectionReference {
    return firestore().collection(`omakes`);
  }

  public static async create(
    name: string,
    description: string
  ): Promise<DocumentReference> {
    const providerRef = User.getOwn();

    const newOmakeRef = Omake.getColRef().doc();
    const activationCodeRef = await ActivationCode.create(newOmakeRef);

    const newOmake: OmakeDocument = {
      name,
      description,
      providerRef,
      activationCodeRef,
      itemRefs: {},
      imageRef: null,
      state: "private",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    return await Omake.getColRef().add(newOmake);
  }

  public constructor(
    readonly name: string,
    readonly description: string,
    readonly imageRef: StorageReference,
    readonly providerRef: DocumentReference,
    readonly activationCodeRef: DocumentReference,
    readonly itemRefs: { [omakeItemId: string]: DocumentReference },
    readonly state: PublishState,
    readonly createdAt: FieldValue,
    readonly updatedAt: FieldValue
  ) {}
}

export { Omake, OmakeDocument };
