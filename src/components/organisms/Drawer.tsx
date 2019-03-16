import * as React from "react";
import { NavLink as Link } from "react-router-dom";

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

import LoginUserDrawerItem from "../molecules/LoginUserDrawerItem";
import SettingsFullDialog from "./SettingsFullDialog";

// TODO check actual drawer style. chrome dev tool siad it's 258.27px.
const drawerWidth = 280;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const StyledDrawer = styled(MuiDrawer)`
  width: ${drawerWidth}px;
`;

const ToolBar = styled.div`
  ${props => props.theme.mixins.toolbar}
`;

const receiverMenuItems = [
  {
    name: "Acricate New Omake",
    icon: <AddIcon />,
    path: "/dashboard/activate"
  },
  {
    name: "Activated Omake List",
    icon: <ListIcon />,
    path: "/dashboard/activated-list"
  }
];

const providerMenuItems = [
  {
    name: "Publish New Omake",
    icon: <AddIcon />,
    path: "/dashboard/publish"
  },
  {
    name: "Published Omake List",
    icon: <AddIcon />,
    path: "/dashboard/published-list"
  }
];

interface DrawerProps {}

const Drawer: React.FunctionComponent<DrawerProps> = props => {
  const { ...others } = props;

  const [isSettingsOpen, setSettingsOpen] = React.useState(false);

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
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
        <LoginUserDrawerItem />
      </List>
    </StyledDrawer>
  );
};

export default Drawer;
