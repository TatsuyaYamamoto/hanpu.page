import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

interface ProductFileAddDialogProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (displayFileName: string, file: File) => void;
}

const ProductFileAddDialog: React.FC<ProductFileAddDialogProps> = ({
  open,
  handleClose,
  onSubmit
}) => {
  const [displayFileName, setDisplayFileName] = React.useState("");
  const [file, setFile] = React.useState<File>(null);

  const canSubmit = React.useMemo(() => {
    return 1 <= displayFileName.length && file !== null;
  }, [displayFileName, file]);

  const onDisplayFileNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayFileName(e.target.value.trim());
  };

  const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length !== 1) {
      // tslint:disable-next-line:no-console TODO
      console.error("unexpected file change event is received");
      return;
    }
    setFile(fileList.item(0));
  };

  const onSubmitClicked = () => {
    onSubmit(displayFileName, file);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"ファイル追加"}</DialogTitle>
      <DialogContent>
        <TextField
          label={"表示ファイル名"}
          value={displayFileName}
          onChange={onDisplayFileNameChanged}
        />
        <TextField
          label={"ファイル"}
          InputProps={{ type: "file" }}
          onChange={onFileChanged}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmitClicked} color="primary" disabled={!canSubmit}>
          OK
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFileAddDialog;
