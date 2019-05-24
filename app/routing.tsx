import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Root from "./components/pages/RootPage";

export default () => (
  <Router>
    <Switch>
      <Route exact={true} path={`/`} component={Root} />
    </Switch>
  </Router>
);
