import * as React from "react";

import styled from "styled-components";

import Footer from "../organisms/Footer";
import LoginCommunication from "../organisms/LoginCommunication";
import LoginForm from "../organisms/LoginForm";

const Root = styled.div`
  display: flex;
  flex-direction: column;

  min-height: 100%;
`;

const LoginContents = styled.div`
  display: flex;
  flex-grow: 1;
`;

const StyledLoginCommunication = styled(LoginCommunication)`
  flex: 1;
`;

const StyledLoginForm = styled(LoginForm)`
  flex: 1;
`;

class Login extends React.Component {
  public render(): React.ReactNode {
    return (
      <Root>
        <LoginContents>
          <StyledLoginCommunication />
          <StyledLoginForm />
        </LoginContents>
        <Footer />
      </Root>
    );
  }
}

export default Login;
