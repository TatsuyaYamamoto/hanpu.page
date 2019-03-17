import { firestore } from "firebase/app";
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;
import FieldValue = firestore.FieldValue;

interface ActivationCodeDocument extends DocumentData {
  /**
   * どのOmakeに対するActivationCodeか
   */
  omakeRef: DocumentReference;

  /**
   * ActivationCodeの文字列
   */
  code: string;

  /**
   * 作成日
   */
  createdAt: FieldValue | Date;
}

class ActivationCode implements ActivationCodeDocument {
  public static getColRef() {
    return firestore().collection("activation_codes");
  }

  public static async create(
    omakeRef: DocumentReference
  ): Promise<DocumentReference> {
    const code = ActivationCode.generateCode();

    const newDoc: ActivationCodeDocument = {
      omakeRef,
      code,
      createdAt: FieldValue.serverTimestamp()
    };

    return await ActivationCode.getColRef().add(newDoc);
  }

  public static async activate(code: string) {
    const snapshot = await ActivationCode.getColRef()
      .where("code", "==", code)
      .get();

    if (snapshot.empty) {
      throw new Error();
    }

    const activationCode = snapshot.docs[0].data() as ActivationCodeDocument;

    if (activationCode.isInfinite) {
    }
  }

  /**
   * @link https://qiita.com/janus_wel/items/40a62afb7dc103fbcd8a
   */
  public static generateCode() {
    return "000-000";
  }

  public constructor(
    readonly omakeRef: DocumentReference,
    readonly code: string,
    readonly createdAt: FieldValue | Date
  ) {}
}

export { ActivationCode, ActivationCodeDocument };
