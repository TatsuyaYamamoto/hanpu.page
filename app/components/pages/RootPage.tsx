import * as React from "react";

import useAuthSession from "../hooks/useAuthSession";

const RootPage = () => {
  const { loginWithTwitter } = useAuthSession();

  return (
    <>
      RootPage
      <button onClick={loginWithTwitter}>login with twitter</button>
    </>
  );
};

export default RootPage;
