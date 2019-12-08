import * as React from "react";

import styled from "styled-components";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import IncorrectIcon from "@material-ui/icons/Close";

type CheckStatus = "progressing" | "valid" | "invalid";

const CheckList = styled.ul``;

const CheckItem = styled.li``;

const LinkedProductDetail = styled.div``;

interface DecodeResult {
  checkList: {
    decoding: CheckStatus;
    format: CheckStatus;
    existing: CheckStatus;
  };
  product: {
    id: string | null;
  };
}

interface CheckDialogProps {
  open: boolean;
  decodeResult: DecodeResult;
  handleClose: () => void;
}

const QrCodeCheckDialog: React.FC<CheckDialogProps> = props => {
  const { open, decodeResult, handleClose } = props;
  const { decoding, format, existing } = decodeResult.checkList;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CheckList>
          <CheckItem>
            {decoding === "progressing" && <CircularProgress />}
            {decoding === "valid" && <CheckIcon />}
            {decoding === "invalid" && <IncorrectIcon />}
            {"QRCode is found."}
          </CheckItem>
          <CheckItem>
            {format === "progressing" && <CircularProgress />}
            {format === "valid" && <CheckIcon />}
            {format === "invalid" && <IncorrectIcon />}
            {"Decoded text is expected URL format."}
          </CheckItem>
          <CheckItem>
            {existing === "progressing" && <CircularProgress />}
            {existing === "valid" && <CheckIcon />}
            {existing === "invalid" && <IncorrectIcon />}
            {"Download Code is existed in DB."}
          </CheckItem>
        </CheckList>
        <LinkedProductDetail>
          <div>Product Name: ${}</div>
          <div>Product ID: ${}</div>
        </LinkedProductDetail>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { DecodeResult };
export default QrCodeCheckDialog;
