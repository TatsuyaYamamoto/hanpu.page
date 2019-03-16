import * as React from "react";

import styled from "styled-components";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const Root = styled.div``;

interface IActivationCodeForm {
  onSubmit: (code: string) => void;
}

const ActivationCodeForm: React.FunctionComponent<
  IActivationCodeForm
> = props => {
  const { onSubmit, ...others } = props;
  const [code, setCode] = React.useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };
  const onSubmitClicked = () => {
    onSubmit(code);
  };

  return (
    <Root {...others}>
      <Grid container={true}>
        <Input
          defaultValue={code}
          onChange={onChange}
          inputProps={{
            "aria-label": "Description"
          }}
        />
      </Grid>
      <Grid container={true}>
        <Button variant="contained" onClick={onSubmitClicked}>
          送信
        </Button>
      </Grid>
    </Root>
  );
};

export default ActivationCodeForm;
