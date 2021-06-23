import { default as React, useState, FC } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import LuxonUtils from "@date-io/luxon";
import { DateTime } from "luxon";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate as PickersDate } from "@material-ui/pickers/typings/date";

interface DownloadCodeSetAddDialogProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (numberOfCodes: number, expiredAt: Date) => void;
}

const DownloadCodeSetAddDialog: FC<DownloadCodeSetAddDialogProps> = ({
  open,
  handleClose,
  onSubmit,
}) => {
  const [numberOfCodes, setNumberOfCodes] = useState<number>(1);

  const [expiredAt, handleExpiredAt] = useState<PickersDate>(DateTime.now());

  const onDisplayFileNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfCodes(parseInt(e.target.value, 10));
  };

  const onSubmitClicked = () => {
    if (!expiredAt) {
      return;
    }

    onSubmit(numberOfCodes, expiredAt.toJSDate());
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"ファイル追加"}</DialogTitle>
      <DialogContent>
        <TextField
          label={"発行数"}
          type="number"
          value={numberOfCodes}
          onChange={onDisplayFileNameChanged}
        />
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <DatePicker
            label="有効期限"
            format="yyyy/MM/dd"
            value={expiredAt}
            onChange={handleExpiredAt}
          />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmitClicked} color="primary">
          OK
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadCodeSetAddDialog;
