import * as React from "react";
import {
  NavLink as Link,
  RouteComponentProps,
  withRouter
} from "react-router-dom";

import styled from "styled-components";

import MuiDrawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import AddIcon from "@material-ui/icons/Add";
import ListIcon from "@material-ui/icons/FormatListBulleted";
import SettingsIcon from "@material-ui/icons/Settings";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { auth } from "firebase/app";

import LoginUserDrawerItem from "../molecules/LoginUserDrawerItem";
import StyledLink from "../helper/StyledLink";
import SettingsFullDialog from "./SettingsFullDialog";

// TODO check actual drawer style. chrome dev tool siad it's 258.27px.
const drawerWidth = 280;

const StyledDrawer = styled(MuiDrawer)`
  width: ${drawerWidth}px;
`;

const ToolBar = styled.div`
  ${props => props.theme.mixins.toolbar}
`;

const receiverMenuItems = [
  {
    name: "Activated Omake List",
    icon: <ListIcon />,
    path: "/dashboard/activated-list"
  },
  {
    name: "Acricate New Omake",
    icon: <AddIcon />,
    path: "/dashboard/activate"
  }
];

const providerMenuItems = [
  {
    name: "Published Omake List",
    icon: <ListIcon />,
    path: "/dashboard/published-list"
  },
  {
    name: "Publish New Omake",
    icon: <AddIcon />,
    path: "/dashboard/publish"
  }
];

const Drawer: React.FunctionComponent<RouteComponentProps> = props => {
  const { location, history, match, staticContext, ...others } = props;

  const [isSettingsOpen, setSettingsOpen] = React.useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleUserMenuOpen = (e: React.MouseEvent) => {
    setUserMenuAnchorEl(e.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    await auth().signOut();
    history.push(`/`);
  };

  return (
    <StyledDrawer
      variant="permanent"
      classes={{
        paper: `width: ${drawerWidth}`
      }}
      anchor="left"
      {...others}
    >
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <SettingsFullDialog
        open={isSettingsOpen}
        handleClose={handleSettingsClose}
      />
      <ToolBar />

      <Divider />

      <List subheader={<ListSubheader component="div">Receiver</ListSubheader>}>
        {receiverMenuItems.map(item => {
          return (
            <StyledLink to={item.path} key={item.name}>
              <ListItem button={true}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            </StyledLink>
          );
        })}
      </List>

      <Divider />

      <List subheader={<ListSubheader component="div">Provider</ListSubheader>}>
        {providerMenuItems.map(item => {
          return (
            <StyledLink to={item.path} key={item.name}>
              <ListItem button={true}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            </StyledLink>
          );
        })}
      </List>

      <Divider />

      <List subheader={<ListSubheader component="div">Account</ListSubheader>}>
        <ListItem button={true} onClick={handleSettingsOpen}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>

        <LoginUserDrawerItem onClick={handleUserMenuOpen} />
      </List>
    </StyledDrawer>
  );
};

export default withRouter(Drawer);
