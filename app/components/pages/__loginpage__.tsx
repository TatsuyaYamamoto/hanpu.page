import * as React from "react";
const { useEffect } = React;
import { RouteComponentProps } from "react-router-dom";

import useAuthSession from "../hooks/useAuthSession";

/**
 * Temporary page having login function.
 * access to twitter idp server automatically
 */
const LoginPage = (props: RouteComponentProps) => {
  const { loginWithTwitter, isLoggedIn, loginCheckState } = useAuthSession();

  useEffect(() => {
    if (loginCheckState === "completed") {
      if (isLoggedIn) {
        props.history.push(`/publish`);
      } else {
        loginWithTwitter();
      }
    }
  }, [loginCheckState]);

  return <>_</>;
};

export default LoginPage;
