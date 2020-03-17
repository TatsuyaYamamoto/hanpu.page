import { default as React } from "react";
import { NextPage } from "next";

import { stringify } from "querystring";

/**
 * QueryParameters:
 *  - Key: c
 *    Description: ダウンロードコードのテキストフィールドに値を入力した状態で表示する
 *
 * @param props
 * @constructor
 */

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
