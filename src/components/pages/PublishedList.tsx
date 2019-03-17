import * as React from "react";

import styled from "styled-components";
import Typography from "@material-ui/core/Typography";

import Drawer from "../organisms/Drawer";
import DashboardContents from "../helper/DashboardContents";
import PublishedOmakeList from "../organisms/PublishedOmakeList";

const Root = styled.div`
  display: flex;
`;

const StyledDrawer = styled(Drawer)`
  flex-shrink: 0;
`;

const StyledDashboardContents = styled(DashboardContents)`
  flex-grow: 1;
`;

class PublishedList extends React.Component {
  public render(): React.ReactNode {
    return (
      <Root>
        <StyledDrawer />
        <StyledDashboardContents>
          <Typography>Published List</Typography>
          <PublishedOmakeList />
        </StyledDashboardContents>
      </Root>
    );
  }
}

export default PublishedList;
