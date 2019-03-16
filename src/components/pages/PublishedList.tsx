import * as React from "react";

import Button from "@material-ui/core/Button";
import Drawer from "../organisms/Drawer";

class PublishedList extends React.Component {
  public render(): React.ReactNode {
    return (
      <React.Fragment>
        <Drawer />
        PublishedList
        <br />
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      </React.Fragment>
    );
  }
}

export default PublishedList;
