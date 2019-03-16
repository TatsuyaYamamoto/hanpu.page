import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";

import loadable from "@loadable/component";

import muiTheme from "./muiTheme";

const Login = loadable(() => import("./components/pages/Login"));
const ActivatedList = loadable(() =>
  import("./components/pages/ActivatedList")
);
const Activate = loadable(() => import("./components/pages/Activate"));
const PublishedList = loadable(() =>
  import("./components/pages/PublishedList")
);
const Publish = loadable(() => import("./components/pages/Publish"));

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    height: 100%;
  }
  #app{
    height: 100%;
  }
`;

const App = () => (
  <React.Fragment>
    <CssBaseline />
    <GlobalStyle />
    <ThemeProvider theme={muiTheme}>
      <Router>
        <Switch>
          <Route
            path={`/`}
            exact={true}
            // tslint:disable-next-line:jsx-no-lambda
            component={(props: any) => <Login {...props} />}
          />
          <Route
            path={`/dashboard/activated-list`}
            // tslint:disable-next-line:jsx-no-lambda
            component={(props: any) => <ActivatedList {...props} />}
          />
          <Route
            path={`/dashboard/activate`}
            // tslint:disable-next-line:jsx-no-lambda
            component={(props: any) => <Activate {...props} />}
          />
          <Route
            path={`/dashboard/published-list`}
            // tslint:disable-next-line:jsx-no-lambda
            component={(props: any) => <PublishedList {...props} />}
          />
          <Route
            path={`/dashboard/publish`}
            // tslint:disable-next-line:jsx-no-lambda
            component={(props: any) => <Publish {...props} />}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  </React.Fragment>
);

export default App;
