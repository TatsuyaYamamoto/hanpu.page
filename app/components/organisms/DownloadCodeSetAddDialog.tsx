import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  MaterialUiPickersDate
} from "@material-ui/pickers";

interface DownloadCodeSetAddDialogProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (numberOfCodes: number, expiredAt: Date) => void;
}

const DownloadCodeSetAddDialog: React.FC<DownloadCodeSetAddDialogProps> = ({
  open,
  handleClose,
  onSubmit
}) => {
  const [numberOfCodes, setNumberOfCodes] = React.useState<number>(1);

  const [expiredAt, setExpiredAt] = React.useState<Date>(new Date());

  const onDisplayFileNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfCodes(parseInt(e.target.value, 10));
  };

  const onExpiredDateChanged = (date: MaterialUiPickersDate) => {
    if (date) {
      setExpiredAt(date);
    }
  };

  const onSubmitClicked = () => {
    onSubmit(numberOfCodes, expiredAt);
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            label="有効期限"
            value={expiredAt}
            onChange={onExpiredDateChanged}
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
