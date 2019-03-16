import * as React from "react";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const Root = styled.div``;

const StyledTextField = styled(TextField)`
  margin-left: ${({ theme }) => theme.spacing.unit}px;
  margin-right: ${({ theme }) => theme.spacing.unit}px;
  width: 200px;
`;

export type PublicationState = "publish" | "unpublish";
export interface IOmakeForm {
  name: string;
  description: string;
  publicationState: PublicationState;
}

interface IActivationCodeForm {
  onSubmit: (form: IOmakeForm) => void;
}

const OmakePublishForm: React.FunctionComponent<
  IActivationCodeForm
> = props => {
  const { onSubmit, ...others } = props;

  // input value status list
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [publicationState, setPublicationState] = React.useState<
    PublicationState
  >("publish");

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onChangePublicationState = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = e.target.value;

    if (newValue !== "publish" && newValue !== "unpublish") {
      return;
    }

    setPublicationState(newValue);
  };

  const onSubmitClicked = () => {
    onSubmit({
      name,
      description,
      publicationState
    });
  };

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
        <TextField
          select={true}
          label="公開状態"
          onChange={onChangePublicationState}
          value={publicationState}
          SelectProps={{
            MenuProps: {
              // className: classes.menu
            }
          }}
          helperText="People can activate this Omake."
          margin="normal"
        >
          <MenuItem value={`publish`}>公開</MenuItem>
          <MenuItem value={`unpublish`}>非公開</MenuItem>
        </TextField>
        <Typography>
          Omakeのサムネイル画像、Omakeのファイルは編集ページで！
        </Typography>
      </Grid>
      <Grid container={true}>
        <Button variant="contained" onClick={onSubmitClicked}>
          送信
        </Button>
      </Grid>
    </Root>
  );
};

export default OmakePublishForm;
