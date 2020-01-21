import * as React from "react";
const { useEffect, useCallback } = React;

import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import { SnackbarProvider } from "notistack";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import useGa from "../components/hooks/useGa";
import { FirebaseContextProvider } from "../components/hooks/useFirebase";

import theme from "../theme";
import configs from "../configs";

const GlobalStyle = createGlobalStyle`
@font-face{
  font-family: PixelMplus10 Regular;
  // TODO: Use file-loader
  src: url('https://cdn.leafscape.be/PixelMplus/PixelMplus10-Regular_web.woff2') format("woff2");
}
body {
}
`;

const MyApp: React.FC<AppProps> = props => {
  const { Component, pageProps } = props;
  const router = useRouter();
  const { init: initGa, logPageView, logError } = useGa();

  const requestErrorDetailContact = useCallback(
    (errorDetail: any) => {
      const { userAgent, language } = navigator;
      const { location } = window;

      const info = {
        error: errorDetail,
        userAgent,
        language,
        location
      };

      logError(JSON.stringify(info), true);

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
    },
    [logError]
  );

  useEffect(() => {
    // GA
    initGa();
    logPageView();
    router.events.on("routeChangeComplete", logPageView);

    // Fatal error handling
    window.onerror = (message, file, lineNo, colNo, error) => {
      const errorDetail = { message, file, lineNo, colNo, error };
      requestErrorDetailContact(errorDetail);
    };

    window.addEventListener("unhandledrejection", e => {
      requestErrorDetailContact(e.reason);
    });
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        {process.env.noIndex && <meta name="robots" content="noindex,follow" />}

        <title>{process.env.title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <meta name="" content={process.env.keyword} />
        <meta name="description" content={process.env.description} />
        <meta name="author" content="https://github.com/TatsuyaYamamoto" />

        <meta property="og:site_name" content={process.env.title} />
        <meta property="og:description" content={process.env.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={process.env.title} />
        <meta
          property="og:image"
          content="https://dl-code.web.app/assets/og.jpg"
        />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:url" content="https://dl-code.web.app" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <GlobalStyle />
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <FirebaseContextProvider
          initParams={{ options: configs.firebaseConfigs }}
        >
          <SnackbarProvider maxSnack={3}>
            <Component {...pageProps} />
          </SnackbarProvider>
        </FirebaseContextProvider>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
