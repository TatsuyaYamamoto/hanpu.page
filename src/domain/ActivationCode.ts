import { firestore } from "firebase/app";
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;

import * as base32 from "hi-base32";

type ActivationCodeValue = string;

interface ActivationCodeDocument extends DocumentData {
  /**
   * どのOmakeに対するActivationCodeか
   */
  omakeRef: DocumentReference;

  /**
   * ActivationCodeの文字列
   */
  code: ActivationCodeValue;

  /**
   * 作成日
   */
  createdAt: firestore.FieldValue | Date;
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
      createdAt: firestore.FieldValue.serverTimestamp()
    };

    return await ActivationCode.getColRef().add(newDoc);
  }

  /**
   * ActivationCodeの文字列を生成する
   *
   * @link https://tools.ietf.org/html/rfc4648#section-6
   * @link https://quesqa.com/random-string-collision-prob/
   * @link https://yu-kimura.jp/2018/03/21/base32/
   * @link https://qiita.com/janus_wel/items/40a62afb7dc103fbcd8a
   */
  public static generateCode() {
    const chars = Array(5)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16));

    return base32.encode(chars.join(""));
  }

  public constructor(
    readonly omakeRef: DocumentReference,
    readonly code: string,
    readonly createdAt: firestore.FieldValue | Date
  ) {}
}

export { ActivationCode, ActivationCodeValue, ActivationCodeDocument };
