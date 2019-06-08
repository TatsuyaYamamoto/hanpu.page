import { firestore } from "firebase/app";
import DocumentReference = firestore.DocumentReference;
import Timestamp = firestore.Timestamp;

import * as base32 from "hi-base32";

interface DownloadCodeSetDocument {
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

  public static async getByProductRef(
    ref: DocumentReference
  ): Promise<DownloadCodeSet[]> {
    const querySnap = await DownloadCodeSet.getColRef()
      .where("productRef", "==", ref)
      .get();

    return querySnap.docs.map(snap => {
      const id = snap.id;
      const data = snap.data() as DownloadCodeSetDocument;

      return new DownloadCodeSet(
        id,
        data.productRef,
        data.codes,
        (data.createdAt as Timestamp).toDate(),
        (data.expiredAt as Timestamp).toDate()
      );
    });
  }

  /**
   * `DownloadCode`を検証する。
   * 正常な`DownloadCode`なら、対応する`Product`のIDを返却する
   *
   * @param code
   */
  public static async verify(code: string): Promise<string | null> {
    const snap = await DownloadCodeSet.getColRef()
      .where(`codes.${code}`, "==", true)
      .get();

    if (snap.empty) {
      return null;
    }

    const { productRef } = snap.docs[0].data() as DownloadCodeSetDocument;

    return productRef.id;
  }

  /**
   *
   * @param productRef
   * @param count
   *
   * TODO 最大作成数は100ぐらい？
   */
  public static async create(
    productRef: DocumentReference,
    numberOfCodes: number,
    expiredAt: Date
  ) {
    const newCodes: {
      [code: string]: boolean;
    } = {};

    [...Array(numberOfCodes)].forEach(() => {
      const code = DownloadCodeSet.generateCode();
      newCodes[code] = true;
    });

    const now = new Date();

    const newSetDocDate: DownloadCodeSetDocument = {
      productRef,
      codes: newCodes,
      createdAt: now,
      expiredAt
    };
    await DownloadCodeSet.getColRef().add(newSetDocDate);
  }

  /**
   * ActivationCodeの文字列を生成する
   *
   * @link https://tools.ietf.org/html/rfc4648#section-6
   * @link https://quesqa.com/random-string-collision-prob/
   * @link https://yu-kimura.jp/2018/03/21/base32/
   * @link https://qiita.com/janus_wel/items/40a62afb7dc103fbcd8a
   */
  public static generateCode(): string {
    const chars = Array(5)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16));

    return base32.encode(chars.join(""));
  }

  public constructor(
    // metadata
    readonly id: string,
    // fields
    readonly productRef: DocumentReference,
    readonly codes: {
      [value: string]: boolean;
    },
    readonly createdAt: Date,
    readonly expiredAt: Date
  ) {}
}

export { DownloadCodeSet, DownloadCodeSetDocument };
