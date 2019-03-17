import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { auth, Unsubscribe, User } from "firebase/app";

import { info } from "../../logger";

interface ILoginSessionContext {
  checkedLoginState: boolean;
  firebaseUser: User | null;
}

const LoginSessionContext = React.createContext<ILoginSessionContext>({
  checkedLoginState: false,
  firebaseUser: null
});

interface IState {
  checkedLoginState: boolean;
  firebaseUser: User | null;
}

class LoginSession extends React.Component<RouteComponentProps, IState> {
  public state: IState = {
    checkedLoginState: false,
    firebaseUser: null
  };
  private unsubscribe: Unsubscribe = null;

  public componentDidMount(): void {
    const { history, location } = this.props;

    this.unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        info(`user is signed in. uid: ${user.uid}`);
        this.handleSignIn(user);
      } else {
        info(`user is signed out.`);
        this.handleSignOut();
      }
    });
  }

  public componentWillUnmount(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  public render(): React.ReactNode {
    const { children } = this.props;
    const { firebaseUser, checkedLoginState } = this.state;
    const contextValue = {
      firebaseUser,
      checkedLoginState
    };

    return (
      <React.Fragment>
        <LoginSessionContext.Provider value={contextValue}>
          {children}
        </LoginSessionContext.Provider>
      </React.Fragment>
    );
  }

  private handleSignIn = (user: User) => {
    this.setState({
      firebaseUser: user,
      checkedLoginState: true
    });

    // redirect
    // TODO check and push to URL before login page.
    const currentPath = location.pathname;
    if (currentPath.startsWith(`/activation`)) {
      return;
    }

    if (!currentPath.startsWith(`/dashboard`)) {
      this.props.history.push(`/dashboard/activated-list`);
    }
  };

  private handleSignOut = () => {
    this.setState({
      firebaseUser: null,
      checkedLoginState: true
    });

    const currentPath = location.pathname;
    if (currentPath.startsWith(`/dashboard`)) {
      this.props.history.push(`/`);
    }
  };
}

export default withRouter(LoginSession);
export { LoginSessionContext };
