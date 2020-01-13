import * as React from "react";
const { useEffect } = React;

import { NextPage } from "next";
import { useRouter } from "next/router";

import Button from "@material-ui/core/Button";

import useAuthSession from "../components/hooks/useAuthSession";

/**
 * Temporary page having login function.
 * access to twitter idp server automatically
 */
const LoginPage: NextPage = () => {
  const { loginWithTwitter, loginUser } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (loginUser) {
      router.push(`/publish/products`);
    }
  }, [loginUser]);

  const login = () => {
    loginWithTwitter();
  };

  return <Button onClick={login}>LOGIN</Button>;
};

export default LoginPage;
