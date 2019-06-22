import * as React from "react";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { initializeApp } from "firebase/app";

import { ThemeProvider, createGlobalStyle } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";

import { SnackbarProvider } from "notistack";

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
      <SnackbarProvider>
        <Routing />
      </SnackbarProvider>
    </ThemeProvider>
  </>
);

window.onerror = (message, file, lineNo, colNo, error) => {
  const errorDetail = { message, file, lineNo, colNo, error };
  requestErrorDetailContact(errorDetail);
};

window.addEventListener("unhandledrejection", e => {
  requestErrorDetailContact(e.reason);
});

const requestErrorDetailContact = (errorDetail: any) => {
  const { userAgent, language } = navigator;
  const { location } = window;

  const info = {
    error: errorDetail,
    userAgent,
    language,
    location
  };

  if (
    confirm(
      "予期せぬエラーが発生してしまいました。\n\n恐れ入りますが、問い合わせフォームを起動してエラーの詳細を送信して頂けませんでしょうか？(エラーの情報は自動で入力されます。)"
    )
  ) {
    const detail = `${btoa(
      unescape(encodeURIComponent(JSON.stringify(info)))
    )}`;
    const contactFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSe5bSPvJ5XQM0IACqZ9NKoHuRUAcC_V1an16JGwHh6HeGd-oQ/viewform?usp=pp_url&entry.1991364045=%E4%B8%8D%E5%85%B7%E5%90%88%E5%A0%B1%E5%91%8A...+/+Bug+Report&entry.326070868=DLCode&entry.1884055698=${detail}`;
    window.location.href = contactFormUrl;
  } else {
    // tslint:disable-next-line:no-console
    console.error(info);
  }
};

export default App;
