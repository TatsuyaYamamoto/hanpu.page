import * as React from "react";
import { RouteComponentProps, Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import DownloadCodeInputCard from "../../organisms/DownloadCodeInputCard";
import DownloadCodeErrorDialog from "../../organisms/DownloadCodeErrorDialog";

import useDownloadCodeVerifier from "../../hooks/useDownloadCodeVerifier";

const Header: React.FC = () => {
  return <>DLCode</>;
};

const Footer: React.FC = () => {
  return (
    <Grid container={true} justify="space-around" alignItems="center">
      <Link to={`/`}>お問い合わせ</Link>
      <Link to={`/`}>DLCode</Link>
      <Link to={`/`}>Twitter</Link>
    </Grid>
  );
};

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
      <Container>
        <Grid
          container={true}
          direction="column"
          justify="space-between"
          style={{ height: "100vh" }}
        >
          <Grid item={true}>
            <Header>DLCode</Header>
          </Grid>
          <Grid item={true}>
            <Grid container={true} justify="center">
              <DownloadCodeInputCard
                value={downloadCode}
                onChange={onChangeDownloadCodeValue}
                onSubmit={submit}
              />
            </Grid>
          </Grid>
          <Grid item={true}>
            <Footer />
          </Grid>
        </Grid>
      </Container>

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
