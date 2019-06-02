import * as React from "react";

import TextField from "@material-ui/core/TextField";

interface IdFieldProps {
  id: string;
}

const IdField: React.FC<IdFieldProps> = ({ id }) => {
  return (
    <TextField
      label={"ID"}
      value={id}
      InputProps={{
        readOnly: true
      }}
    />
  );
};

export default IdField;
