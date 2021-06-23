import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import { ProductDescription, ProductName } from "../../domains/Product";
import useProductEditor from "../hooks/useProductEditor";

interface ProductAddDialogProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (creationPromise: Promise<any>) => void;
}

const ProductAddDialog: React.FC<ProductAddDialogProps> = (props) => {
  const { open, handleClose, onSubmit } = props;
  const [name, setName] = React.useState<ProductName>("" as ProductName);
  const [description, setDescription] = React.useState<ProductDescription>(
    "" as ProductDescription
  );
  const productEditor = useProductEditor();

  const canSubmit = React.useMemo(() => {
    return 1 <= name.length && 0 <= description.length;
  }, [name, description]);

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.trim() as ProductName);
  };

  const onDescriptionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value.trim() as ProductDescription);
  };

  const onSubmitClicked = () => {
    onSubmit(productEditor.addProduct(name, description));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"新規プロダクト作成"}</DialogTitle>
      <DialogContent>
        <TextField
          label={"プロダクト名"}
          value={name}
          onChange={onNameChanged}
        />
        <TextField
          label={"説明"}
          value={description}
          onChange={onDescriptionChanged}
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

export default ProductAddDialog;
