import { firestore, auth } from "firebase/app";
import DocumentData = firestore.DocumentData;
import DocumentReference = firestore.DocumentReference;
import Timestamp = firestore.Timestamp;

import { ProductFile } from "./ProductFile";

interface ProductDocument extends DocumentData {
  name: string;
  description: string;
  privateNote: string;
  fileRefs: DocumentReference[];
  ownerUid: string;
  createdAt: Date | firestore.FieldValue;
}

class Product implements ProductDocument {
  public static getColRef() {
    return firestore().collection(`products`);
  }

  public static getDocRef(id: string) {
    return Product.getColRef().doc(id);
  }

  public static async getOwns(): Promise<Product[]> {
    const owner = auth().currentUser;
    if (!owner) {
      // TODO
      // tslint:disable:no-console
      console.error("not logged-in");
      return [];
    }

    const ownProductsSnap = await Product.getColRef()
      .where("ownerUid", "==", owner.uid)
      .get();

    const owns: { [id: string]: Product } = {};

    return ownProductsSnap.docs.map(doc => {
      const {
        name,
        description,
        privateNote,
        ownerUid,
        fileRefs,
        createdAt
      } = doc.data() as ProductDocument;

      return new Product(
        doc.id,
        name,
        description,
        privateNote,
        ownerUid,
        fileRefs,
        (createdAt as Timestamp).toDate()
      );
    });
  }

  public static async getById(id: string): Promise<Product | null> {
    const snap = await Product.getColRef()
      .doc(id)
      .get();

    if (!snap.exists) {
      return null;
    }
    const {
      name,
      description,
      privateNote,
      ownerUid,
      fileRefs,
      createdAt
    } = snap.data() as ProductDocument;

    return new Product(
      snap.id,
      name,
      description,
      privateNote,
      ownerUid,
      fileRefs,
      (createdAt as Timestamp).toDate()
    );
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
      fileRefs: [],
      createdAt: firestore.FieldValue.serverTimestamp()
    };

    await Product.getColRef().add(newProductDoc);
  }

  public constructor(
    // metadata
    readonly id: string,

    // document fields
    readonly name: string,
    readonly description: string,
    readonly privateNote: string,
    readonly ownerUid: string,
    readonly fileRefs: DocumentReference[],
    readonly createdAt: Date
  ) {}

  public get ref() {
    return Product.getDocRef(this.id);
  }

  public getFiles = async (): Promise<ProductFile[]> => {
    const allProductFileGetPromises = this.fileRefs.map(ref =>
      ProductFile.getById(ref.id)
    );

    return await Promise.all(allProductFileGetPromises);
  };

  public addProductFile = async (
    productFile: ProductFile
  ): Promise<Product> => {
    const docRef = Product.getDocRef(this.ref.id);

    const updateDoc: Partial<Product> = {
      fileRefs: [...this.fileRefs, productFile.ref]
    };
    await docRef.update(updateDoc);

    return new Product(
      this.id,
      this.name,
      this.description,
      this.privateNote,
      this.ownerUid,
      updateDoc.fileRefs,
      this.createdAt
    );
  };
}

export { Product, ProductDocument };
