import { firestore, auth } from "firebase/app";
import DocumentData = firestore.DocumentData;
import DocumentReference = firestore.DocumentReference;

interface ProductDocument extends DocumentData {
  name: string;
  description: string;
  privateNote: string;
  ownerUid: string;
  createdAt: Date | firestore.FieldValue;
}

class Product implements ProductDocument {
  public static getColRef() {
    return firestore().collection(`products`);
  }

  public static async createNew(params: {
    name: string;
    description?: string;
    privateNote: string;
  }): Promise<void> {
    const { name, description, privateNote } = params;

    const owner = auth().currentUser;
    if (!owner) {
      return;
    }

    const newProductDoc: ProductDocument = {
      name,
      description,
      privateNote,
      ownerUid: owner.uid,
      createdAt: firestore.FieldValue.serverTimestamp()
    };

    await Product.getColRef().add(newProductDoc);
  }

  public constructor(
    readonly name: string,
    readonly description: string,
    readonly privateNote: string,
    readonly ownerUid: string,
    readonly createdAt: Date | firestore.FieldValue
  ) {}
}

export { Product, ProductDocument };
