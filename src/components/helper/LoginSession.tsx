import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { auth, Unsubscribe, User } from "firebase/app";

interface ILoginSessionContext {
  firebaseUser: User | null;
}

const LoginSessionContext = React.createContext<ILoginSessionContext>({
  firebaseUser: null
});

interface IState {
  firebaseUser: User | null;
}

class LoginSession extends React.Component<RouteComponentProps, IState> {
  public state: IState = {
    firebaseUser: null
  };
  private unsubscribe: Unsubscribe = null;

  public componentDidMount(): void {
    const { history } = this.props;

    this.unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.setState({
          firebaseUser: user
        });

        // redirect
        // TODO check and push to URL before login page.
        history.push("/dashboard/activated-list");
      } else {
        // User is signed out.
        this.setState({
          firebaseUser: null
        });
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
    const { firebaseUser } = this.state;
    const contextValue = {
      firebaseUser
    };

    return (
      <React.Fragment>
        <LoginSessionContext.Provider value={contextValue}>
          {children}
        </LoginSessionContext.Provider>
      </React.Fragment>
    );
  }
}

export default withRouter(LoginSession);
export { LoginSessionContext };
