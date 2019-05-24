import * as React from "react";

import "firebase/auth";
import { initializeApp, auth } from "firebase/app";

initializeApp({
  apiKey: "AIzaSyDkyIH-immHfoQY59kbEfWi9T1npPTUv0k",
  authDomain: "dl-code-dev.firebaseapp.com",
  databaseURL: "https://dl-code-dev.firebaseio.com",
  projectId: "dl-code-dev",
  storageBucket: "dl-code-dev.appspot.com",
  messagingSenderId: "170382784624",
  appId: "1:170382784624:web:42b794526ad81a74"
});

auth().onAuthStateChanged(user => {
  if (user) {
    // tslint:disable-next-line:no-console
    console.log(user);
  } else {
    // tslint:disable-next-line:no-console
    console.log("sign-out");
  }
});

import Routing from "./routing";

const App = () => (
  <>
    <Routing />
  </>
);

export default App;
