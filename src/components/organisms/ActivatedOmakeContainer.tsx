import * as React from "react";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const Root = styled.div``;
const Name = styled.div``;
const Detail = styled.div``;
const Thumbnail = styled.img``;
const ActivationCodeButton = styled(Button)``;

const omakeItems = [
  {
    id: "1",
    name: "君のこころは輝いてるかい?",
    fileType: "WAV",
    fileSize: "200MB",
    fileName: "君のこころは輝いてるかい.wav"
  },
  {
    id: "2",
    name: "Step! ZERO to ONE",
    fileType: "WAV",
    fileSize: "200MB",
    fileName: "Step! ZERO to ONE.wav"
  },
  {
    id: "3",
    name: "Aqours☆HEROES",
    fileType: "WAV",
    fileSize: "200MB",
    fileName: "Aqours☆HEROES.wav"
  }
];

interface ActivatedOmakeListProps {
  id: string;
}

const ActivatedOmakeList: React.FC<ActivatedOmakeListProps> = props => {
  const { id } = props;
  const [
    isActivationCodeDialogOpen,
    setActivationCodeDialogOpen
  ] = React.useState(false);

  const handleActivationCodeDialogOpen = () => {
    setActivationCodeDialogOpen(true);
  };

  const handleActivationCodeDialogClose = () => {
    setActivationCodeDialogOpen(false);
  };

  return (
    <Root>
      <Name>activated omake detail ID: ${id}</Name>
      <Thumbnail src={""} />
      <Detail>
        hogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehoge
      </Detail>
      <ActivationCodeButton onClick={handleActivationCodeDialogOpen}>
        Activation
      </ActivationCodeButton>

      {omakeItems.map(item => {
        return (
          <div key={item.id}>
            <div>{item.name}</div>
            <div>{item.fileType}</div>
            <div>{item.fileSize}</div>
            <div>{item.fileName}</div>
            <Button>{`ダウンロード`}</Button>
          </div>
        );
      })}

      <Dialog open={isActivationCodeDialogOpen}>
        {" "}
        <DialogTitle>{"Activation Code"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{`QRコード`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActivationCodeDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default ActivatedOmakeList;
