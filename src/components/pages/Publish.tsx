import * as React from "react";

import styled from "styled-components";
import { Paper } from "@material-ui/core";

import Drawer from "../organisms/Drawer";
import DashboardContents from "../helper/DashboardContents";
import OmakePublishForm, { OmakeForm } from "../organisms/OmakePublishForm";

import { Omake } from "../../domain/Omake";
import OmakeCreationDialog, {
  OmakeCreationDialogState
} from "../organisms/OmakeCreationDialog";

const Root = styled.div`
  display: flex;
`;

const StyledDrawer = styled(Drawer)`
  flex-shrink: 0;
`;

const StyledDashboardContents = styled(DashboardContents)`
  flex-grow: 1;
`;

interface PublishProps {}

interface PublishStates {
  creationDialogState: OmakeCreationDialogState;
}

class Publish extends React.Component<PublishProps, PublishStates> {
  public constructor(props: any) {
    super(props);

    this.state = {
      creationDialogState: "close"
    };
  }

  public render(): React.ReactNode {
    const { creationDialogState } = this.state;

    return (
      <Root>
        <StyledDrawer />
        <StyledDashboardContents>
          <Paper>
            Publish
            <OmakePublishForm onSubmit={this.onOmakePublishSubmitted} />
          </Paper>
        </StyledDashboardContents>

        <OmakeCreationDialog
          state={creationDialogState}
          handleNotifyAccept={this.handleAccept}
        />
      </Root>
    );
  }

  private onOmakePublishSubmitted = async (form: OmakeForm) => {
    this.setState({ creationDialogState: "progress" });
    await Omake.create(form.name, form.description);
    this.setState({ creationDialogState: "success" });
  };

  private handleAccept = () => {
    this.setState({ creationDialogState: "close" });
  };
}

export default Publish;
