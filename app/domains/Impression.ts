import firebase from "firebase/app";
type DocumentReference = firebase.firestore.DocumentReference;
type FieldValue = firebase.firestore.FieldValue;

export interface ImpressionDocument {
  productRef: DocumentReference;
  text: string;
  createdAt: Date | FieldValue;
}

export class Impression {
  public static getColRef() {
    return firebase.firestore().collection(`impressions`);
  }

  public static async post(
    productRef: DocumentReference,
    text: string
  ): Promise<void> {
    const newImpression: ImpressionDocument = {
      productRef,
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await Impression.getColRef().add(newImpression);
  }
}
