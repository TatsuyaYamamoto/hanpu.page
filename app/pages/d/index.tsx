import * as React from "react";
const { useState } = React;

import { NextPage } from "next";
import { useRouter } from "next/router";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import LinkButton from "../../components/atoms/LinkButton";
import DownloadCodeInputCard from "../../components/organisms/DownloadCodeInputCard";
import DownloadCodeErrorDialog from "../../components/organisms/DownloadCodeErrorDialog";
import AppBar from "../../components/organisms/AppBar";
import Footer from "../../components/organisms/Footer";

import useDownloadCodeVerifier from "../../components/hooks/useDownloadCodeVerifier";

/**
 * QueryParameters:
 *  - Key: c
 *    Description: ダウンロードコードのテキストフィールドに値を入力した状態で表示する
 *
 * @param props
 * @constructor
 */
const DownloadPage: NextPage<{ code: string }> = props => {
  const router = useRouter();
  const [downloadCode, setDownloadCode] = useState(props.code);
  const [openNotFoundDialog, setOpenNotFoundDialog] = useState(false);

  const { verifyDownloadCode } = useDownloadCodeVerifier();

  const onChangeDownloadCodeValue = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDownloadCode(e.target.value);
  };

  const submit = () => {
    verifyDownloadCode(downloadCode)
      .then(() => {
        router.push(`/d/dashboard`);
      })
      .catch(_ => {
        handleNotFoundDialog();
      });
  };

  const handleNotFoundDialog = () => {
    setOpenNotFoundDialog(!openNotFoundDialog);
  };

  return (
    <>
      <>
        <Grid
          container={true}
          direction="column"
          justify="space-between"
          style={{ height: "100vh" }}
        >
          <AppBar />

          <Container>
            <Grid container={true} justify="center">
              <DownloadCodeInputCard
                value={downloadCode}
                onChange={onChangeDownloadCodeValue}
                onSubmit={submit}
              />
            </Grid>
            <Grid container={true} justify="center">
              <LinkButton href={`/d/dashboard`}>
                過去にコードを入力したコンテンツを見る
              </LinkButton>
            </Grid>
          </Container>

          <Footer />
        </Grid>
      </>
      <DownloadCodeErrorDialog
        message={
          // TODO: handle all errors
          "ダウンロードコードが不正です。入力した文字に間違いがないか確認してください。"
        }
        open={openNotFoundDialog}
        handleClose={handleNotFoundDialog}
      />
    </>
  );
};

DownloadPage.getInitialProps = ({ query }) => {
  const code = (query.c as string) || "";
  return {
    code
  };
};

export default DownloadPage;
