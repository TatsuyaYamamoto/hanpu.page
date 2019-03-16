import * as React from "react";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";

const StyledAppBar = styled(AppBar)`
  position: relative;
`;

const StyledAppBarTitle = styled(Typography)`
  flex: 1;
`;

const SettingsBody = styled.div`
  margin-top: ${({ theme }) => theme.mixins.toolbar.minHeight}px;
`;

const DialogTransition = (props: any) => {
  return <Slide direction="up" {...props} />;
};

interface SettingsFullDialogProps {
  open: boolean;
  handleClose: () => void;
}

const SettingsFullDialog: React.FC<SettingsFullDialogProps> = props => {
  const { open, handleClose, ...others } = props;

  return (
    <Dialog
      fullScreen={true}
      open={open}
      onClose={handleClose}
      TransitionComponent={DialogTransition}
      {...others}
    >
      <StyledAppBar>
        <Toolbar>
          <IconButton color="inherit" onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <StyledAppBarTitle variant="h6" color="inherit">
            Settings
          </StyledAppBarTitle>
        </Toolbar>
      </StyledAppBar>
      <SettingsBody>
        <List>
          <ListItem button={true}>
            <TextField label={`Name`} />
          </ListItem>
          <Divider />
          <ListItem button={true}>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem>
        </List>
      </SettingsBody>
    </Dialog>
  );
};

export default SettingsFullDialog;
