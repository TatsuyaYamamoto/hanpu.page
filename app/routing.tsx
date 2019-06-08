import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Root from "./components/pages/RootPage";
import Login from "./components/pages/__loginpage__";
import Settings from "./components/pages/SettingsPage";

import Download from "./components/pages/download/IndexPage";
import DownloadDashboard from "./components/pages/download/Dashboard";

import PublishIndex from "./components/pages/publish/IndexPage";
import NewProduct from "./components/pages/publish/NewProduct";
import ProductList from "./components/pages/publish/ProductListPage";
import ProductDetail from "./components/pages/publish/ProductDetailPage";

const RedirectToRoot = () => <Redirect to={`/`} />;

export default () => (
  <Router>
    <Switch>
      <Route exact={true} path={`/`} component={Root} />
      <Route exact={true} path={`/__login__`} component={Login} />
      <Route exact={true} path={`/settings`} component={Settings} />
      <Route exact={true} path={`/d/:code?`} component={Download} />
      <Route
        exact={true}
        path={`/download/dashboard`}
        component={DownloadDashboard}
      />
      <Route exact={true} path={`/publish`} component={PublishIndex} />
      <Route exact={true} path={`/publish/new`} component={NewProduct} />
      <Route exact={true} path={`/publish/products`} component={ProductList} />
      <Route
        exact={true}
        path={`/publish/products/:id`}
        component={ProductDetail}
      />
      {/* TODO: route 404 page. */}
      <Route path={`*`} component={RedirectToRoot} />
    </Switch>
  </Router>
);
