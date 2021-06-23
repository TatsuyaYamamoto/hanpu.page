```ts
/**
 * @fileOverview
 * QRコードに印字するために、VerifyPageへアクセスできる短縮パスを定義する。
 * queryはそのまま、/download/verifyへredirectする。
 *
 * 元々は{@link NextPage#getInitialProps}でリダイレクト処理を書いていた
 * 現在はFirebase hostingの設定でリダイレクトを行っている。詳細は firebase.jsonを参照。
 *
 * QueryParameters:
 *  - Key: c
 *    Description: ダウンロードコードのテキストフィールドに値を入力した状態で表示する
 */
import { default as React } from "react";
import { NextPage } from "next";

const DPage: NextPage = () => {
  return <></>;
};

export default DPage;
```
