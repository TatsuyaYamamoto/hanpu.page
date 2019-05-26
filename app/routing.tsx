import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Root from "./components/pages/RootPage";
import Download from "./components/pages/download/IndexPage";
import PublishIndex from "./components/pages/publish/IndexPage";
import NewProduct from "./components/pages/publish/NewProduct";

export default () => (
  <Router>
    <Switch>
      <Route exact={true} path={`/`} component={Root} />
      <Route exact={true} path={`/download`} component={Download} />
      <Route exact={true} path={`/publish`} component={PublishIndex} />
      <Route exact={true} path={`/publish/new`} component={NewProduct} />
    </Switch>
  </Router>
);
