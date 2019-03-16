import * as React from "react";

import styled from "styled-components";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
`;

const LoginButtonBlock = styled.div``;

const LoginForm: React.FunctionComponent = props => {
  const { ...others } = props;

  return (
    <Root {...others}>
      <LoginButtonBlock id={`idd`}>
        <Typography>Omake.pageでOmakeをもらう！</Typography>
        <Button>Twitterでログイン</Button>
        <Button>Emailアドレスでログイン</Button>
      </LoginButtonBlock>
    </Root>
  );
};

export default LoginForm;
