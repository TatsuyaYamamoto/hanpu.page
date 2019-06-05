import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import DownloadCodeInputCard from "../../organisms/DownloadCodeInputCard";
import DownloadCodeErrorDialog from "../../organisms/DownloadCodeErrorDialog";
import AppBar from "../../organisms/AppBar";
import Footer from "../../organisms/Footer";

import useDownloadCodeVerifier from "../../hooks/useDownloadCodeVerifier";

interface IndexPageProps extends RouteComponentProps<{ code?: string }> {}

const IndexPage: React.FC<IndexPageProps> = props => {
  const [downloadCode, setDownloadCode] = React.useState(
    props.match.params.code || ""
  );
  const [openNotFoundDialog, setOpenNotFoundDialog] = React.useState(false);

  const { verifyDownloadCode } = useDownloadCodeVerifier();

  const onChangeDownloadCodeValue = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDownloadCode(e.target.value);
  };

  const submit = () => {
    verifyDownloadCode(downloadCode)
      .then(() => {
        props.history.push(`/download/dashboard`);
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

export default IndexPage;
