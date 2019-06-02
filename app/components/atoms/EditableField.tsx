import * as React from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

interface EditableFieldProps {
  label: string;
  defaultValue: string;
  multiline?: boolean;
  onSubmit: (newValue: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  defaultValue,
  multiline,
  onSubmit
}) => {
  const [editing, setEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(defaultValue);

  const handleEditingState = () => {
    setEditing(!editing);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const onCancelClicked = () => {
    setEditValue(defaultValue);
    handleEditingState();
  };

  const onUpdateClicked = () => {
    onSubmit(editValue);
    setEditing(false);
  };

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <TextField
          label={label}
          value={editValue}
          multiline={!!multiline}
          onChange={onChange}
          InputProps={{
            readOnly: !editing
          }}
        />
      </Box>

      {!editing && (
        <Box p={1}>
          <Button onClick={handleEditingState}>編集</Button>
        </Box>
      )}
      {editing && (
        <Box>
          <Button variant="outlined" onClick={onUpdateClicked}>
            更新
          </Button>
          <Button variant="outlined" onClick={onCancelClicked}>
            キャンセル
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EditableField;
