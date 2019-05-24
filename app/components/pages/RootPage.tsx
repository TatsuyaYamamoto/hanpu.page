import * as React from "react";

import { auth } from "firebase/app";

const RootPage = () => {
  const loginWithTwitter = () => {
    const provider = new auth.TwitterAuthProvider();
    auth().signInWithRedirect(provider);
  };

  return (
    <>
      RootPage
      <button onClick={loginWithTwitter}>login with twitter</button>
    </>
  );
};

export default RootPage;
