import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";

import loadable from "@loadable/component";

import muiTheme from "./muiTheme";
import LoginPage from "./components/pages/Login";
import ActivationPage from "./components/pages/Activation";
import LoginSession from "./components/helper/LoginSession";

// firebase
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  // omake-page-development
  apiKey: "AIzaSyCGqlm_LzlS-uTnGEqVzrAxHXXsVKMcUCM",
  authDomain: "omake-page-development.firebaseapp.com",
  databaseURL: "https://omake-page-development.firebaseio.com",
  projectId: "omake-page-development",
  storageBucket: "omake-page-development.appspot.com",
  messagingSenderId: "522822324756"
};
initializeApp(firebaseConfig);

const ActivatedList = loadable(() =>
  import("./components/pages/ActivatedList")
);
const ActivatedDetail = loadable(() =>
  import("./components/pages/ActivatedDetail")
);
const Activate = loadable(() => import("./components/pages/Activate"));
const PublishedList = loadable(() =>
  import("./components/pages/PublishedList")
);
const PublishedEdit = loadable(() =>
  import("./components/pages/PublishedEdit")
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
        <LoginSession>
          <Switch>
            {/* tslint:disable:jsx-no-lambda */}
            <Route path={`/`} exact={true} component={LoginPage} />
            <Route path={`/activation/:code`} component={ActivationPage} />
            <Route
              path={`/dashboard/activate`}
              component={(props: any) => <Activate {...props} />}
            />
            <Route
              path={`/dashboard/activated-list`}
              component={(props: any) => <ActivatedList {...props} />}
            />
            <Route
              path={`/dashboard/activated/:omakeId`}
              component={(props: any) => <ActivatedDetail {...props} />}
            />
            <Route
              path={`/dashboard/published-list`}
              component={(props: any) => <PublishedList {...props} />}
            />
            <Route
              path={`/dashboard/publishes/:omakeId`}
              component={(props: any) => <PublishedEdit {...props} />}
            />
            <Route
              path={`/dashboard/publish`}
              component={(props: any) => <Publish {...props} />}
            />
            {/* tslint:enable:jsx-no-lambda */}
          </Switch>
        </LoginSession>
      </Router>
    </ThemeProvider>
  </React.Fragment>
);

export default App;
