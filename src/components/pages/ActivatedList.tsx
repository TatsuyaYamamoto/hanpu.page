import * as React from "react";

import styled from "styled-components";
import Typography from "@material-ui/core/Typography";

import Drawer from "../organisms/Drawer";
import ActivatedOmakeList from "../organisms/ActivatedOmakeList";
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

class ActivatedList extends React.Component {
  public render(): React.ReactNode {
    return (
      <Root>
        <StyledDrawer />
        <StyledDashboardContents>
          <Typography>Activated List</Typography>
          <ActivatedOmakeList />
        </StyledDashboardContents>
      </Root>
    );
  }
}

export default ActivatedList;
