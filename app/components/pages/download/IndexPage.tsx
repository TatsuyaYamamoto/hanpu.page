import * as React from "react";
const { useState, useEffect } = React;
import { RouteComponentProps } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import LinkButton from "../../atoms/LinkButton";
import useGa from "../../hooks/useGa";
import DownloadCodeInputCard from "../../organisms/DownloadCodeInputCard";
import DownloadCodeErrorDialog from "../../organisms/DownloadCodeErrorDialog";
import AppBar from "../../organisms/AppBar";
import Footer from "../../organisms/Footer";

import useDownloadCodeVerifier from "../../hooks/useDownloadCodeVerifier";

interface IndexPageProps extends RouteComponentProps<{ code?: string }> {}

/**
 * QueryParameters:
 *  - Key: c
 *    Description: ダウンロードコードのテキストフィールドに値を入力した状態で表示する
 *
 * @param props
 * @constructor
 */
const DownloadPage: React.FC<IndexPageProps> = props => {
  const params = new URLSearchParams(props.location.search);
  const [downloadCode, setDownloadCode] = useState(params.get("c") || "");
  const [openNotFoundDialog, setOpenNotFoundDialog] = useState(false);

  const { verifyDownloadCode } = useDownloadCodeVerifier();
  const { gtagPageView } = useGa();

  useEffect(() => {
    gtagPageView(props.location.pathname);
  }, []);

  const onChangeDownloadCodeValue = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDownloadCode(e.target.value);
  };

  const submit = () => {
    verifyDownloadCode(downloadCode)
      .then(() => {
        props.history.push(`/d/dashboard`);
      })
      .catch(e => {
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
              <LinkButton to={`/d/dashboard`}>
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

export default DownloadPage;
