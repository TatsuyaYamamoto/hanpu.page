import { firestore } from "firebase/app";
import DocumentData = firestore.DocumentData;
import DocumentReference = firestore.DocumentReference;
import Timestamp = firestore.Timestamp;

import { Product, ProductDocument } from "./Product";

interface DownloadCodeSetDocument extends DocumentData {
  productRef: DocumentReference;
  codes: {
    [value: string]: boolean;
  };
  createdAt: Date | firestore.FieldValue;
  expiredAt: Date | firestore.FieldValue;
}

class DownloadCodeSet {
  public static getColRef() {
    return firestore().collection(`downloadCodeSets`);
  }

  public static async verify(code: string): Promise<Product | null> {
    const snap = await DownloadCodeSet.getColRef()
      .where(`codes.${code}`, "==", true)
      .get();

    if (snap.empty) {
      return null;
    }

    const { productRef } = snap.docs[0].data() as DownloadCodeSetDocument;
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      // TODO
      // tslint:disable:no-console
      console.error("fatal error!");
      return null;
    }

    const productDoc = productSnap.data() as ProductDocument;
    const {
      name,
      description,
      privateNote,
      ownerUid,
      fileRefs,
      createdAt
    } = productDoc;

    return new Product(
      productSnap.id,
      name,
      description,
      privateNote,
      ownerUid,
      fileRefs,
      (createdAt as Timestamp).toDate()
    );
  }

  /**
   *
   * @param productRef
   * @param count
   *
   * TODO 最大作成数は100ぐらい？
   */
  public static async create(productRef: DocumentReference, count: number) {
    const newCodes: {
      [code: string]: boolean;
    } = {};

    [...Array(count)].forEach(() => {
      const code = DownloadCodeSet.generateCode();
      newCodes[code] = true;
    });

    const now = new Date();
    const expiredAt = new Date(
      now.getTime() + 1 * 12 * 30 * 24 * 60 * 60 * 1000
    );

    const newSetDocDate: DownloadCodeSetDocument = {
      productRef,
      codes: newCodes,
      createdAt: now,
      expiredAt
    };
    await DownloadCodeSet.getColRef().add(newSetDocDate);
  }

  protected static generateCode(): string {
    return `${Math.random().toString()}`;
  }
}

export { DownloadCodeSet, DownloadCodeSetDocument };
