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
import SuspendedIcon from "@material-ui/icons/Block";

type CheckStatus = "progressing" | "valid" | "invalid" | "suspended";

const CheckList = styled.ul``;

const CheckItem = styled.li``;

const LinkedProductDetail = styled.div``;

interface DecodeResult {
  checkList: {
    decoding: CheckStatus;
    format: CheckStatus;
    existing: CheckStatus;
  };
  detail: {
    decodedText: string | null;
    productId: string | null;
    productName: string | null;
    downloadCodeCreatedAt: Date | null;
    downloadCodeExpireAt: Date | null;
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

  const icon = (checkStatus: CheckStatus) => (
    <>
      {checkStatus === "progressing" && <CircularProgress />}
      {checkStatus === "valid" && <CheckIcon />}
      {checkStatus === "invalid" && <IncorrectIcon />}
      {checkStatus === "suspended" && <SuspendedIcon />}
    </>
  );

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CheckList>
          <CheckItem>
            {icon(decoding)}
            {"QRCode is found."}
          </CheckItem>
          <CheckItem>
            {icon(format)}
            {"Decoded text is expected URL format."}
          </CheckItem>
          <CheckItem>
            {icon(existing)}
            {"Download Code is existed in DB."}
          </CheckItem>
        </CheckList>
        <LinkedProductDetail>
          <div>{`Decoded Text: ${decodeResult.detail.decodedText}`}</div>
          <div>{`Product ID:   ${decodeResult.detail.productId}`}</div>
          <div>{`Product Name: ${decodeResult.detail.productName}`}</div>
          <div>{`Code Created Date: ${
            decodeResult.detail.downloadCodeCreatedAt
          }`}</div>
          <div>{`Code Expire Date: ${
            decodeResult.detail.downloadCodeExpireAt
          }`}</div>
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
