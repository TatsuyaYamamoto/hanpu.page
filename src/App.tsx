import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import loadable from "@loadable/component";

import muiTheme from "./muiTheme";

const ActivatedList = loadable(() =>
  import("./components/pages/ActivatedList")
);
const Activate = loadable(() => import("./components/pages/Activate"));
const PublishedList = loadable(() =>
  import("./components/pages/PublishedList")
);
const Publish = loadable(() => import("./components/pages/Publish"));

const App = () => (
  <React.Fragment>
    <ThemeProvider theme={muiTheme}>
      <Router>
        <Switch>
          <Route
            path={`/dashboard/activated-list`}
            exact={true}
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
