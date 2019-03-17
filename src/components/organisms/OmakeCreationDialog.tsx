import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

type OmakeCreationDialogState = "close" | "progress" | "success";

interface OmakeCreationDialogProps {
  state: OmakeCreationDialogState;
  handleNotifyAccept: () => void;
}

const OmakeCreationDialog: React.FC<OmakeCreationDialogProps> = props => {
  const { state, handleNotifyAccept } = props;
  const open = state !== "close";

  return (
    <Dialog open={open}>
      <DialogTitle>{`OK`}</DialogTitle>
      <DialogContent>
        <DialogContentText>{`Success create new omake. state: ${state}`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNotifyAccept} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { OmakeCreationDialogState, OmakeCreationDialogProps };
export default OmakeCreationDialog;
