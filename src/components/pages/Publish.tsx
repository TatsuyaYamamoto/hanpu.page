import * as React from "react";

import styled from "styled-components";
import { Paper } from "@material-ui/core";

import Drawer from "../organisms/Drawer";
import DashboardContents from "../helper/DashboardContents";
import OmakePublishForm, { IOmakeForm } from "../organisms/OmakePublishForm";

const Root = styled.div`
  display: flex;
`;

const StyledDrawer = styled(Drawer)`
  flex-shrink: 0;
`;

const StyledDashboardContents = styled(DashboardContents)`
  flex-grow: 1;
`;

class Publish extends React.Component {
  public render(): React.ReactNode {
    return (
      <Root>
        <StyledDrawer />
        <StyledDashboardContents>
          <Paper>
            Publish
            <OmakePublishForm onSubmit={this.onOmakePublishSubmitted} />
          </Paper>
        </StyledDashboardContents>
      </Root>
    );
  }

  private onOmakePublishSubmitted = (form: IOmakeForm) => {
    console.log(form);
  };
}

export default Publish;
