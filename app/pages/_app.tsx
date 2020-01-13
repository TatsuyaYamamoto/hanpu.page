import * as React from "react";

import { AppProps } from "next/app";
import Head from "next/head";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import theme from "../theme";

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

  return (
    <>
      <Head>
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
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default MyApp;
