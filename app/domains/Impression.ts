import { firestore } from "firebase/app";
type DocumentReference = firestore.DocumentReference;

export interface ImpressionDocument {
  productRef: DocumentReference;
  text: string;
  createdAt: Date | firestore.FieldValue;
}

export class Impression {
  public static getColRef() {
    return firestore().collection(`impressions`);
  }

  public static async post(
    productRef: DocumentReference,
    text: string
  ): Promise<void> {
    const newImpression: ImpressionDocument = {
      productRef,
      text,
      createdAt: firestore.FieldValue.serverTimestamp()
    };

    await Impression.getColRef().add(newImpression);
  }
}
