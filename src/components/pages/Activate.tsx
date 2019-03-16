import * as React from "react";

import styled from "styled-components";

import Drawer from "../organisms/Drawer";
import ActivationCodeForm from "../organisms/ActivationCodeForm";
import DashboardContents from "../helper/DashboardContents";

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
          Activate
          <ActivationCodeForm />
        </StyledDashboardContents>
      </Root>
    );
  }
}

export default Activate;
