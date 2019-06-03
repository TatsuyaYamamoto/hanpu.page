import * as React from "react";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { initializeApp } from "firebase/app";

import { ThemeProvider, createGlobalStyle } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";

initializeApp({
  apiKey: "AIzaSyDkyIH-immHfoQY59kbEfWi9T1npPTUv0k",
  authDomain: "dl-code-dev.firebaseapp.com",
  databaseURL: "https://dl-code-dev.firebaseio.com",
  projectId: "dl-code-dev",
  storageBucket: "dl-code-dev.appspot.com",
  messagingSenderId: "170382784624",
  appId: "1:170382784624:web:42b794526ad81a74"
});

const GlobalStyle = createGlobalStyle`
@font-face{
  font-family: PixelMplus10 Regular;
  // TODO: Use file-loader
  src: url('https://cdn.leafscape.be/PixelMplus/PixelMplus10-Regular_web.woff2') format("woff2");
}
body {
}
`;

import Routing from "./routing";
import theme from "./theme";

const App = () => (
  <>
    <CssBaseline />
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <Routing />
    </ThemeProvider>
  </>
);

export default App;
