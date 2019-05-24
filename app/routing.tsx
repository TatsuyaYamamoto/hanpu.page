import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Root from "./components/pages/RootPage";
import Download from "./components/pages/DownloadPage";
import Dashboard from "./components/pages/dashboard/IndexPage";

export default () => (
  <Router>
    <Switch>
      <Route exact={true} path={`/`} component={Root} />
      <Route exact={true} path={`/download`} component={Download} />
      <Route exact={true} path={`/dashboard`} component={Dashboard} />
    </Switch>
  </Router>
);
