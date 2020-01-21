import * as React from "react";
const { useEffect } = React;

import { NextPage } from "next";
import { useRouter } from "next/router";

import Button from "@material-ui/core/Button";

import useFirebase from "../components/hooks/useFirebase";

/**
 * Temporary page having login function.
 * access to twitter idp server automatically
 */
const LoginPage: NextPage = () => {
  const { loginWithTwitter, user } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(`/publish/products`);
    }
  }, [user]);

  const login = () => {
    loginWithTwitter();
  };

  return <Button onClick={login}>LOGIN</Button>;
};

export default LoginPage;
