import { default as React } from "react";

import { NextPage } from "next";
import { stringify } from "querystring";

const CallbackPage: NextPage = () => {
  return <></>;
};

CallbackPage.getInitialProps = (context) => {
  const { res, query } = context;
  const { to, ...otherQueries } = query;
  const redirectUri = Array.isArray(to) ? to[0] : to || "/";
  const queryString = stringify(otherQueries);

  if (res) {
    res.writeHead(302, {
      Location: `${redirectUri}?${queryString}`,
    });
    res.end();
  }

  return {};
};

export default CallbackPage;
