import * as React from "react";

import styled from "styled-components";
import Paper from "@material-ui/core/Paper";

import Drawer from "../organisms/Drawer";
import ActivationCodeForm from "../organisms/ActivationCodeForm";
import DashboardContents from "../helper/DashboardContents";
import { log } from "../../logger";

const Root = styled.div`
  display: flex;
`;

const StyledDrawer = styled(Drawer)`
  flex-shrink: 0;
`;

const StyledDashboardContents = styled(DashboardContents)`
  flex-grow: 1;
`;

class Activate extends React.Component {
  public render(): React.ReactNode {
    return (
      <Root>
        <StyledDrawer />
        <StyledDashboardContents>
          <Paper>
            Activate
            <ActivationCodeForm onSubmit={this.onActivationSubmitted} />
          </Paper>
        </StyledDashboardContents>
      </Root>
    );
  }

  private onActivationSubmitted = (code: string) => {
    log(`submit: ${code}`);
  };
}

export default Activate;
