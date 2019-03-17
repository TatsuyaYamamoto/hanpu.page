import { firestore } from "firebase/app";
import DocumentReference = firestore.DocumentReference;
import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;

import {
  ActivationCode,
  ActivationCodeDocument,
  ActivationCodeValue
} from "./ActivationCode";
import OmakeError from "./OmakeError";
import { User } from "./User";
import * as logger from "../logger";

interface ActivationDocument extends DocumentData {
  /**
   * どのOmakeに対するActivationか
   */
  omakeRef: DocumentReference;

  /**
   * どのActivationCodeによるActivationか
   */
  codeRef: DocumentReference;

  /**
   * どのUserのActivationか
   */
  userRef: DocumentReference;

  /**
   * Activation実行日
   */

  activatedAt: firestore.FieldValue | Date;
}

class Activation implements ActivationDocument {
  /**
   * Return CollectionReference
   */
  public static getColRef(): CollectionReference {
    return firestore().collection("activations");
  }

  public static async activate(code: ActivationCodeValue): Promise<void> {
    const ownUserRef = User.getOwn();
    logger.debug(`getting own user ref is succeed. uid: ${ownUserRef.id}`);

    const activationCodeQuery = ActivationCode.getColRef().where(
      "code",
      "==",
      code
    );
    const activationCodeSnapshot = await activationCodeQuery.get();

    if (activationCodeSnapshot.empty) {
      logger.debug(`provided activation code doesn't exist.`);
      // throw new Error();
      throw new OmakeError("invalid-activation-code");
    } else {
      logger.debug(`provided activation code exists.`);
    }

    const activationCodeDocSnap = activationCodeSnapshot.docs[0];
    const activationCodeRef = activationCodeDocSnap.ref;
    const activationCodeDoc = activationCodeDocSnap.data() as ActivationCodeDocument;

    const newActivation: ActivationDocument = {
      omakeRef: activationCodeDoc.omakeRef,
      codeRef: activationCodeRef,
      userRef: ownUserRef,
      activatedAt: firestore.FieldValue.serverTimestamp()
    };
    logger.debug(`create new activation doc.`, newActivation);

    await Activation.getColRef().add(newActivation);
    logger.info(`add new activation.`, newActivation);
  }

  public constructor(
    readonly omakeRef: DocumentReference,
    readonly codeRef: DocumentReference,
    readonly userRef: DocumentReference,
    readonly activatedAt: firestore.FieldValue | Date
  ) {}
}

export { Activation, ActivationDocument };
