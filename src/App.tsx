import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import loadable from "@loadable/component";

const ActivatedList = loadable(
  () => import("./components/pages/ActivatedList"));
const Activate = loadable(
  () => import("./components/pages/Activate"));
const PublishedList = loadable(
  () => import("./components/pages/PublishedList"));
const Publish = loadable(
  () => import("./components/pages/Publish"));

const App = () => (
  <React.Fragment>
    <Router>
      <Switch>
        <Route path={`/`}
               exact={true}
               component={(props: any) => (<ActivatedList {...props}/>)}/>
        <Route path={`/activate`}
               component={(props: any) => (<Activate {...props}/>)}/>
        <Route path={`/published-list`}
               component={(props: any) => (<PublishedList {...props}/>)}/>
        <Route path={`/publish`}
               component={(props: any) => (<Publish {...props}/>)}/>
      </Switch>
    </Router>
  </React.Fragment>
);

export default App;
