import * as React from "react";

import {
  default as MuiAppBar,
  AppBarProps as MuiAppBarProps
} from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import styled from "styled-components";

import FlexSpace from "../atoms/FlexSpace";
import Logo from "../atoms/Logo";
import useFirebase from "../hooks/useFirebase";

const StyledMuiAppBar = styled(MuiAppBar as React.FC<MuiAppBarProps>)`
  && {
    background-color: transparent;
    color: grey;
    z-index: 99;
  }
`;

interface AppBarProps {
  onBack?: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ onBack }) => {
  const { user, logout } = useFirebase();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const back = (
    <IconButton color="inherit" onClick={onBack}>
      <Icon>arrow_back</Icon>
    </IconButton>
  );
  const logo = (
    <Typography variant="h6" color="inherit">
      <Logo />
    </Typography>
  );

  const handleMenu = (event?: any) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  const menus = [
    {
      label: "ログアウト",
      onClick: () => {
        handleMenu();
        logout();
      }
    }
  ];

  const userIcon = user ? (
    <>
      <IconButton onClick={handleMenu}>
        <Avatar src={user && user.photoURL ? user.photoURL : ""} />
      </IconButton>
      <Menu
        keepMounted={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenu}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        {menus.map(menu => (
          <MenuItem key={menu.label} onClick={menu.onClick}>
            {menu.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  ) : (
    <></>
  );

  return (
    <>
      <StyledMuiAppBar position="static">
        <Toolbar>
          {onBack ? back : logo}
          <FlexSpace />
          {userIcon}
        </Toolbar>
      </StyledMuiAppBar>
    </>
  );
};

export default AppBar;
