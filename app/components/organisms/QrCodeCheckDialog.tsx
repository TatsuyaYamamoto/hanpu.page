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
import { format as dateFormat } from "date-fns";

export type CheckStatus = "progressing" | "valid" | "invalid" | "suspended";

const ProgressIcon = () => <CircularProgress size={24} />;

const CheckList = styled.ul`
  padding-left: 0;
  list-style: none;
`;

const CheckItem = styled.li``;

const CheckStatusIcon = styled.span`
  display: inline-block;
  vertical-align: middle;
`;

const CheckDescription = styled.span`
  margin-left: 10px;
`;

const LinkedProductDetail = styled.div`
  display: table;
`;

const LinkedProductDetailItem = styled.div`
  display: table-row;
`;

const DetailLabel = styled.span`
  display: table-cell;
  min-width: 120px;
  padding: 5px 0;
`;

const DetailValue = styled.span`
  display: table-cell;
`;

export interface DecodeResult {
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
      {checkStatus === "progressing" && <ProgressIcon />}
      {checkStatus === "valid" && <CheckIcon />}
      {checkStatus === "invalid" && <IncorrectIcon />}
      {checkStatus === "suspended" && <SuspendedIcon />}
    </>
  );

  const createdDate = decodeResult.detail.downloadCodeCreatedAt
    ? dateFormat(
        decodeResult.detail.downloadCodeCreatedAt,
        "yyyy/MM/dd hh:mm:ss xxx"
      )
    : null;

  const expireDate = decodeResult.detail.downloadCodeExpireAt
    ? dateFormat(
        decodeResult.detail.downloadCodeExpireAt,
        "yyyy/MM/dd hh:mm:ss xxx"
      )
    : null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <CheckList>
          <CheckItem>
            <CheckStatusIcon> {icon(decoding)}</CheckStatusIcon>
            <CheckDescription>{"QRCode is found."}</CheckDescription>
          </CheckItem>
          <CheckItem>
            <CheckStatusIcon>{icon(format)}</CheckStatusIcon>
            <CheckDescription>{"URL format is expected."}</CheckDescription>
          </CheckItem>
          <CheckItem>
            <CheckStatusIcon>{icon(existing)}</CheckStatusIcon>
            <CheckDescription>
              {"A download code Code is saved."}
            </CheckDescription>
          </CheckItem>
        </CheckList>
        <LinkedProductDetail>
          <LinkedProductDetailItem>
            <DetailLabel>{`Decoded Text`}</DetailLabel>
            <DetailValue>{`${decodeResult.detail.decodedText}`}</DetailValue>
          </LinkedProductDetailItem>
          <LinkedProductDetailItem>
            <DetailLabel>{`Product ID`}</DetailLabel>
            <DetailValue>{`${decodeResult.detail.productId}`}</DetailValue>
          </LinkedProductDetailItem>
          <LinkedProductDetailItem>
            <DetailLabel>{`Product Name`}</DetailLabel>
            <DetailValue>{`${decodeResult.detail.productName}`}</DetailValue>
          </LinkedProductDetailItem>
          <LinkedProductDetailItem>
            <DetailLabel>{`Created Date`}</DetailLabel>
            <DetailValue>{`${createdDate}`}</DetailValue>
          </LinkedProductDetailItem>
          <LinkedProductDetailItem>
            <DetailLabel>{`Expire Date`}</DetailLabel>
            <DetailValue>{`${expireDate}`}</DetailValue>
          </LinkedProductDetailItem>
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

export default QrCodeCheckDialog;
