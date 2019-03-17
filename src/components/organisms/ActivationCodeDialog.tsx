import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import QrCodeView from "../molecules/QrCodeView";

interface ActivationCodeDialogProps {
  open: boolean;
  code: string;
  handleClose: () => void;
}

const ActivationCodeDialog: React.FC<ActivationCodeDialogProps> = props => {
  const { open, code, handleClose } = props;

  return (
    <Dialog open={open}>
      <DialogTitle>{`Activation Code`}</DialogTitle>
      <DialogContent>
        <QrCodeView text={code} />
        <DialogContentText>{`このQRコードを読み込むことで、Omakeをダウンロード出来るようになります。`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { ActivationCodeDialogProps };
export default ActivationCodeDialog;
