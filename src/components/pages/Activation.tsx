import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { auth } from "firebase/app";

import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { LoginSessionContext } from "../helper/LoginSession";
import { log } from "../../logger";

const Root = styled.div`
  display: flex;
`;

const LoggingStateChecking = () => {
  return (
    <div>
      <CircularProgress />
      <div>checking login...</div>
    </div>
  );
};

const LoginRequest = () => {
  const onCLicked = () => {
    const provider = new auth.TwitterAuthProvider();
    return auth().signInWithRedirect(provider);
  };

  return (
    <div>
      <div>please login</div>
      <Button onClick={onCLicked}>OK</Button>
    </div>
  );
};

interface StartActivateProps {
  code: string;
}

const StartActivate: React.FC<StartActivateProps> = props => {
  const { code } = props;
  const onCLicked = () => {
    log("try activating");
  };

  return (
    <div>
      <div>{`start activation code: ${code}`}</div>
      <Button onClick={onCLicked}>OK</Button>
    </div>
  );
};

interface ActivationPageProps extends RouteComponentProps<{ code: string }> {}

class ActivationPage extends React.Component<ActivationPageProps> {
  public render(): React.ReactNode {
    const { code } = this.props.match.params;

    return (
      <Root>
        <Paper>
          <LoginSessionContext.Consumer>
            {({ firebaseUser, checkedLoginState }) => {
              if (!checkedLoginState) {
                return <LoggingStateChecking />;
              }

              if (!firebaseUser) {
                return <LoginRequest />;
              }

              return <StartActivate code={code} />;
            }}
          </LoginSessionContext.Consumer>
        </Paper>
      </Root>
    );
  }
}

export default ActivationPage;
