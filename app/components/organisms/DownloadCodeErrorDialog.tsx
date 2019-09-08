import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

interface NotFoundDialogProps {
  message: string;
  open: boolean;
  handleClose: () => void;
}

const DownloadCodeErrorDialog: React.FC<NotFoundDialogProps> = props => {
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

export default DownloadCodeErrorDialog;
