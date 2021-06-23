import { FC, useState, ChangeEvent, MouseEvent } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";

import useImpression from "../hooks/useImpression";

export interface ImpressionFormProps {
  productId: string;
}

const ImpressionForm: FC<ImpressionFormProps> = props => {
  const { productId } = props;
  const [text, setText] = useState("");
  const [isDialogOpen, handleDialog] = useState(false);
  const { postImpression } = useImpression();
  const disableSubmit = text.length === 0;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const onSubmitClicked = (_: MouseEvent<HTMLButtonElement>) => {
    postImpression(productId, text).then(() => {
      // 送信が成功したら、テキストボックスは空欄になるのが自然との意見もあるが、実際はどっちだろうか
      setText("");
      handleDialog(true);
    });
  };

  const handleCloseDialog = (_: MouseEvent<HTMLButtonElement>) => {
    handleDialog(false);
  };

  return (
    <>
      <Paper>
        <Typography>ご感想はこちらへ！</Typography>
        <TextField
          multiline={true}
          margin="normal"
          variant="outlined"
          fullWidth={true}
          value={text}
          onChange={onChange}
        />
        <Button disabled={disableSubmit} onClick={onSubmitClicked}>
          送信
        </Button>
      </Paper>

      <Dialog open={isDialogOpen}>
        <DialogTitle>ありがとうございました（・８・）</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImpressionForm;
