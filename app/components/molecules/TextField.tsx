import { GridProps } from "@material-ui/core/Grid";
import * as React from "react";
const { useState } = React;

import { InputBase, Input, Grid, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import styled from "styled-components";

const LabelArea: React.FC<GridProps> = styled(Grid)`
  flex-basis: 150px;
  // follow a style of InputBase
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/InputBase/InputBase.js
  padding: ${8 - 2}px 0 ${8 - 1}px;
`;

const InputArea: React.FC<GridProps> = styled(Grid)``;

interface TextFieldProps {
  label: string;
  defaultValue?: string;
  onSubmit?: (value: string) => void;
  readonly?: true;
  multiline?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  defaultValue,
  onSubmit,
  readonly,
  multiline,
  children
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

  return (
    <Grid container={true}>
      <LabelArea item={true}>{label}</LabelArea>
      <InputArea item={true} xs={true}>
        {children
          ? children
          : readonly
          ? readonlyInput
          : editing
          ? editingInput
          : editableInput}
      </InputArea>
    </Grid>
  );
};

export default TextField;
