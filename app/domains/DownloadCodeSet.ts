import { firestore } from "firebase/app";
import DocumentData = firestore.DocumentData;
import DocumentReference = firestore.DocumentReference;

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

  public static async isValid(code: string) {
    const snap = await DownloadCodeSet.getColRef()
      .where(`codes/${code}`, "==", true)
      .get();
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
