import { firestore, storage } from "firebase/app";
import CollectionReference = firestore.CollectionReference;
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;
import StorageReference = storage.Reference;

import { User, UserDocument } from "./User";
import { ActivationCode } from "./ActivationCode";
import { Activation, ActivationDocument } from "./Activation";
import * as logger from "../logger";

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
    await newOmakeRef.set(newOmake);

    return newOmakeRef;
  }

  public static async getOwnPublishes(): Promise<Map<string, Omake>> {
    const providerRef = User.getOwn();
    const query = Omake.getColRef().where("providerRef", "==", providerRef);
    const querySnapshot = await query.get();

    const publishes = new Map();
    for (const snapshot of querySnapshot.docs) {
      const doc = snapshot.data() as OmakeDocument;

      publishes.set(
        snapshot.id,
        new Omake(
          doc.name,
          doc.description,
          doc.imageRef,
          doc.providerRef,
          doc.activationCodeRef,
          doc.itemRefs,
          doc.state,
          (doc.createdAt as Timestamp).toDate(),
          (doc.updatedAt as Timestamp).toDate()
        )
      );
    }

    return publishes;
  }

  public static async getOwnActivatedList(): Promise<Map<string, Omake>> {
    const ownRef = await User.getOwn();
    logger.debug(`getting own user ref is succeed. uid: ${ownRef.id}`);

    const activationListQuery = Activation.getColRef().where(
      "userRef",
      "==",
      ownRef
    );
    const activationListQuerySnap = await activationListQuery.get();
    logger.debug(`got ${activationListQuerySnap.size} activation docs.`);

    const activated = new Map<string, Omake>();
    await Promise.all(
      activationListQuerySnap.docs.map(activationSnap => {
        const activationDoc = activationSnap.data() as ActivationDocument;
        const activatedOmakeRef = activationDoc.omakeRef;
        return activatedOmakeRef.get().then(activatedOmake => {
          const activatedOmakeDoc = activatedOmake.data() as OmakeDocument;
          activated.set(
            activationSnap.id,
            new Omake(
              activatedOmakeDoc.name,
              activatedOmakeDoc.description,
              activatedOmakeDoc.imageRef,
              activatedOmakeDoc.providerRef,
              activatedOmakeDoc.activationCodeRef,
              activatedOmakeDoc.itemRefs,
              activatedOmakeDoc.state,
              (activatedOmakeDoc.createdAt as Timestamp).toDate(),
              (activatedOmakeDoc.updatedAt as Timestamp).toDate()
            )
          );
        });
      })
    );

    logger.info(`got ${activated.size} activated omake docs.`);
    return activated;
  }

  public constructor(
    readonly name: string,
    readonly description: string,
    readonly imageRef: StorageReference,
    readonly providerRef: DocumentReference,
    readonly activationCodeRef: DocumentReference,
    readonly itemRefs: { [omakeItemId: string]: DocumentReference },
    readonly state: PublishState,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}
}

export { Omake, OmakeDocument };
