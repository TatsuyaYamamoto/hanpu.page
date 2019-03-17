import * as React from "react";

import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const Root = styled.div``;

const StyledTextField = styled(TextField)`
  margin-left: ${({ theme }) => theme.spacing.unit}px;
  margin-right: ${({ theme }) => theme.spacing.unit}px;
  width: 200px;
`;

interface ActivationCodeForm {}

const PublishedEditForm: React.FunctionComponent<
  ActivationCodeForm
> = props => {
  const { ...others } = props;

  // input value status list
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.trim());
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value.trim());
  };

  // todo validate
  const handleButtonDisable = name === "" || description === "";

  return (
    <Root {...others}>
      <Grid container={true}>
        <StyledTextField
          label="Omake Name"
          margin="normal"
          onChange={onChangeName}
        />
        <StyledTextField
          label="Description"
          multiline={true}
          margin="normal"
          onChange={onChangeDescription}
        />
        <Typography>
          Omakeのサムネイル画像、Omakeのファイルは編集ページで！
        </Typography>
      </Grid>
    </Root>
  );
};

export { ActivationCodeForm };
export default PublishedEditForm;
