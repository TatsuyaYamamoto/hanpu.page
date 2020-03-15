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
  const { c, ...otherQueries } = query;
  const code = Array.isArray(c) ? c[0] : c || "";
  const queryString = stringify({ code, ...otherQueries });

  if (res) {
    res.writeHead(302, {
      Location: `/download/verify?${queryString}`
    });
    res.end();
  }

  return {};
};

export default DPage;
