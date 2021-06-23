import { default as React } from "react";

import { NextPage } from "next";

/**
 * auth0のcallbackUrl用のpath
 * callbackされるとき、auth0用query(state,code), dl-code.web.app用query(nextPath)がURLに付いているが、
 * {@link useAuth0}で処理を行うため、ここでは何も行わない
 */
const CallbackPage: NextPage = () => {
  return <></>;
};

export default CallbackPage;
