import * as React from "react";
const { useState } = React;

import { InputBase, Input, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

interface FormInputProps {
  defaultValue?: string;
  onSubmit?: (value: string) => void;
  readonly?: true;
  multiline?: boolean;
}

const ProductDetailFormInput: React.FC<FormInputProps> = ({
  defaultValue,
  onSubmit,
  readonly,
  multiline
}) => {
  const [editing, setEditing] = React.useState(false);
  const [editValue, setEditValue] = useState(defaultValue);

  const handleEditingState = () => {
    setEditing(!editing);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const onClearClicked = () => {
    setEditValue(defaultValue);
    handleEditingState();
  };

  const onCheckClicked = () => {
    onSubmit(editValue);
    setEditing(false);
  };

  const readonlyInput = (
    <InputBase
      defaultValue={editValue}
      fullWidth={true}
      multiline={!!multiline}
      inputProps={{
        readOnly: true
      }}
    />
  );

  const editableInput = (
    <InputBase
      defaultValue={editValue}
      fullWidth={true}
      multiline={!!multiline}
      endAdornment={
        <IconButton onClick={handleEditingState}>
          <EditIcon />
        </IconButton>
      }
      inputProps={{
        readOnly: true
      }}
    />
  );

  const editingInput = (
    <Input
      defaultValue={editValue}
      fullWidth={true}
      multiline={multiline}
      endAdornment={
        <>
          <IconButton onClick={onCheckClicked}>
            <CheckIcon />
          </IconButton>
          <IconButton onClick={onClearClicked}>
            <ClearIcon />
          </IconButton>
        </>
      }
      onChange={onChange}
    />
  );

  return readonly ? readonlyInput : editing ? editingInput : editableInput;
};

export default ProductDetailFormInput;
