import * as React from "react";

import { FirebaseAuthSessionContext } from "../utils/FirebaseAuthSession";

const RootPage = () => {
  const { loginWithTwitter } = React.useContext(FirebaseAuthSessionContext);

  return (
    <>
      RootPage
      <button onClick={loginWithTwitter}>login with twitter</button>
    </>
  );
};

export default RootPage;
