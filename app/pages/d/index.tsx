/**
 * @fileOverview
 * DL-QRCodeにエンコードするためのための短縮パスを定義する{@link NextPage}.
 * queryはそのまま、/download/verifyへredirectする。
 *
 * !!!!!!IMPORTANT!!!!!!
 * next.js(v9.1.7)はtrailing slashに対応していないため、hostingでredirectの設定を行っている。
 * firebase.jsonを参照。
 *
 * QueryParameters:
 *  - Key: c
 *    Description: ダウンロードコードのテキストフィールドに値を入力した状態で表示する
 */
import { default as React } from "react";
import { NextPage } from "next";

import { stringify } from "querystring";

const DPage: NextPage = () => {
  return <></>;
};

DPage.getInitialProps = context => {
  const { res, query } = context;
  const queryString = stringify(query);

  if (res) {
    res.writeHead(302, {
      Location: `/download/verify?${queryString}`
    });
    res.end();
  }

  return {};
};

export default DPage;
