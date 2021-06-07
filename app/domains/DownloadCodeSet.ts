import { firestore } from "firebase/app";
import * as base32 from "hi-base32";

type DocumentReference = firestore.DocumentReference;
type Timestamp = firestore.Timestamp;

export interface DownloadCodeSetDocument {
  productRef: DocumentReference;
  // TODO: check permission to handle code resources
  codes: {
    [value: string]: boolean;
  };
  description: string | null;
  createdAt: Date | firestore.FieldValue;
  expiredAt: Date | firestore.FieldValue;
}

export class DownloadCodeSet implements DownloadCodeSetDocument {
  // TODO: remove dependency of firestore instance.
  public static getColRef() {
    return firestore().collection(`downloadCodeSets`);
  }

  public static getDocRef(id: string) {
    return DownloadCodeSet.getColRef().doc(id);
  }

  public static watchListByProductRef(
    ref: DocumentReference,
    callback: (downloadCodeSets: DownloadCodeSet[]) => void
  ): () => void {
    const query = DownloadCodeSet.getColRef().where("productRef", "==", ref);

    return query.onSnapshot(querySnap => {
      const downloadCodeSets = querySnap.docs.map(snap => {
        const id = snap.id;
        const data = snap.data({
          serverTimestamps: "estimate"
        }) as DownloadCodeSetDocument;

        return new DownloadCodeSet(
          id,
          data.productRef,
          data.codes,
          data.description,
          (data.createdAt as Timestamp).toDate(),
          (data.expiredAt as Timestamp).toDate()
        );
      });

      callback(downloadCodeSets);
    });
  }

  /**
   * `DownloadCode`を検証する。
   * 正常な`DownloadCode`なら、対応する`Product`のIDを返却する
   *
   * @param code
   */
  public static async verify(
    code: string
  ): Promise<{
    productId: string;
    expiredAt: Date;
  } | null> {
    const snap = await DownloadCodeSet.getColRef()
      .where(`codes.${code}`, "==", true)
      .get();

    if (snap.empty) {
      return null;
    }

    const doc = snap.docs[0].data() as DownloadCodeSetDocument;

    return {
      productId: doc.productRef.id,
      expiredAt: (doc.expiredAt as Timestamp).toDate()
    };
  }

  /**
   *
   * @param productRef
   * @param numberOfCodes
   * @param expiredAt
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
      description: null,
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
    readonly description: string | null,
    readonly createdAt: Date,
    readonly expiredAt: Date
  ) {}

  public get ref() {
    return DownloadCodeSet.getDocRef(this.id);
  }
}
