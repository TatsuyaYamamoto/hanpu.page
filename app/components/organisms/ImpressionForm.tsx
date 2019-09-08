import * as React from "react";
const { useState, useMemo, useCallback } = React;

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

interface ImpressionFormProps {
  productId: string;
}

const ImpressionForm: React.FC<ImpressionFormProps> = props => {
  const { productId } = props;

  const [text, setText] = useState<string>("");

  const [submitState, setSubmitState] = useState<
    "waiting" | "sending" | "success"
  >("waiting");

  const { postImpression } = useImpression();

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  }, []);

  const canSubmit = useMemo(() => {
    return text !== "" && submitState === "waiting";
  }, [text, submitState]);

  const openDialog = useMemo(() => {
    return submitState === "success";
  }, [submitState]);

  const onSubmitClicked = useCallback(
    (_: React.MouseEvent<HTMLButtonElement>) => {
      if (!text) {
        return;
      }
      setSubmitState("sending");

      postImpression(productId, text).then(() => {
        setSubmitState("success");

        // 送信が成功したら、テキストボックスは空欄になるのが自然との意見もあるが、実際はどっちだろうか
        setText("");
      });
    },
    [productId, text]
  );

  const handleCloseDialog = useCallback(
    (_: React.MouseEvent<HTMLButtonElement>) => {
      setSubmitState("waiting");
    },
    [productId, text]
  );

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
        <Button disabled={!canSubmit} onClick={onSubmitClicked}>
          送信
        </Button>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
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
export { ImpressionFormProps };
