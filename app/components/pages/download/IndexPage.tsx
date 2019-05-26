import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import { DownloadCodeSet } from "../../../domains/DownloadCodeSet";
import { DownloaderContext } from "../../utils/Downloader";

interface NotFoundDialogProps {
  open: boolean;
  handleClose: () => void;
}

const NotFoundDialog: React.FC<NotFoundDialogProps> = props => {
  const { open, handleClose } = props;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>
          {
            "ダウンロードコードが不正です。入力した文字に間違いがないか確認してください。"
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const IndexPage: React.FC<RouteComponentProps<{ code?: string }>> = props => {
  const [downloadCode, setDownloadCode] = React.useState(
    props.match.params.code || ""
  );
  const [openNotFoundDialog, setOpenNotFoundDialog] = React.useState(false);
  const { addProduct } = React.useContext(DownloaderContext);

  const onChangeDownloadCodeValue = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDownloadCode(e.target.value);
  };

  const disableSubmit = downloadCode.length === 0;

  const submit = () => {
    DownloadCodeSet.verify(downloadCode).then(p => {
      // TODO
      // tslint:disable:no-console
      console.log(p);

      if (p) {
        addProduct(p);
        props.history.push(`/download/dashboard`);
      } else {
        handleNotFoundDialog();
      }
    });
  };

  const handleNotFoundDialog = () => {
    setOpenNotFoundDialog(!openNotFoundDialog);
  };

  return (
    <>
      <Typography>DownloadPage</Typography>
      <TextField
        label="ダウンロードコード"
        value={downloadCode}
        onChange={onChangeDownloadCodeValue}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocalOffer />
            </InputAdornment>
          )
        }}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={disableSubmit}
        onClick={submit}
      >
        実行
      </Button>

      <NotFoundDialog
        open={openNotFoundDialog}
        handleClose={handleNotFoundDialog}
      />
    </>
  );
};

export default IndexPage;
