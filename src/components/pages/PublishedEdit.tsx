import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import styled from "styled-components";
import Typography from "@material-ui/core/Typography";

import Drawer from "../organisms/Drawer";
import DashboardContents from "../helper/DashboardContents";
import PublishedEditForm from "../organisms/PublishedEditForm";

const Root = styled.div`
  display: flex;
`;

const StyledDrawer = styled(Drawer)`
  flex-shrink: 0;
`;

const StyledDashboardContents = styled(DashboardContents)`
  flex-grow: 1;
`;

class PublishedEdit extends React.Component<
  RouteComponentProps<{ omakeId: string }>
> {
  public render(): React.ReactNode {
    const { omakeId } = this.props.match.params;
    return (
      <Root>
        <StyledDrawer />
        <StyledDashboardContents>
          <Typography>{`Published Edit ${omakeId}`}</Typography>
          <PublishedEditForm />
        </StyledDashboardContents>
      </Root>
    );
  }
}

export default PublishedEdit;
