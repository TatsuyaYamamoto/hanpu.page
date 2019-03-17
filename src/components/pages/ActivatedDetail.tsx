import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import styled from "styled-components";
import Typography from "@material-ui/core/Typography";

import Drawer from "../organisms/Drawer";
import ActivatedOmakeContainer from "../organisms/ActivatedOmakeContainer";
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

class ActivatedDetail extends React.Component<
  RouteComponentProps<{ omakeId: string }>
> {
  public render(): React.ReactNode {
    const { omakeId } = this.props.match.params;

    return (
      <Root>
        <StyledDrawer />
        <StyledDashboardContents>
          <Typography>Activated List</Typography>
          <ActivatedOmakeContainer id={omakeId} />
        </StyledDashboardContents>
      </Root>
    );
  }
}

export default ActivatedDetail;
