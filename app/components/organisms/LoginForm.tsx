import * as React from "react";

import styled from "styled-components";

import Paper, { PaperProps } from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import useFirebase from "../hooks/useFirebase";
import Logo from "../atoms/Logo";

const Root = styled(Paper as React.FC<PaperProps>)`
  max-width: 380px;
  padding: 30px;
`;

const AppTitle = styled.div`
  font-size: 50px;
  text-align: center;
  padding: 43px 0 41px;
`;

const Form = styled.div`
  margin: 30px;
  padding: 20px;
`;

const LoginForm: React.FC<{ className: string }> = props => {
  const { className } = props;
  const { loginWithTwitter } = useFirebase();

  const login = () => {
    return loginWithTwitter();
  };

  return (
    <Root className={className}>
      <AppTitle>
        <Logo />
      </AppTitle>
      <Form>
        <Button
          fullWidth={true}
          style={{ textTransform: "none" }}
          onClick={login}
        >
          Twitterでログイン
        </Button>
      </Form>
    </Root>
  );
};

export default LoginForm;
