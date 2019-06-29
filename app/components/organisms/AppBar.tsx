import * as React from "react";
const { useState } = React;
import { withRouter } from "react-router-dom";

import {
  default as MuiAppBar,
  AppBarProps as MuiAppBarProps
} from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import styled from "styled-components";

import FlexSpace from "../atoms/FlexSpace";
import Logo from "../atoms/Logo";

import useAuthSession from "../hooks/useAuthSession";

const StyledMuiAppBar = styled(MuiAppBar as React.FC<MuiAppBarProps>)`
  && {
    background-color: transparent;
    color: grey;
    z-index: 99;
  }
`;

// @ts-ignore
const AppBarMenu = withRouter(({ history }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const { logout, isLoggedIn } = useAuthSession();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleLogout = () => {
    logout();
  };

  const handleSettings = () => {
    history.push(`/settings`);
  };

  return (
    <>
      <IconButton
        aria-owns={openMenu ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Icon>more_vert</Icon>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={openMenu}
        onClose={handleMenu}
      >
        {isLoggedIn && <MenuItem onClick={handleLogout}>ログアウト</MenuItem>}
        <MenuItem onClick={handleSettings}>設定</MenuItem>
      </Menu>
    </>
  );
});

interface AppBarProps {
  onBack?: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ onBack }) => {
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

  return (
    <>
      <StyledMuiAppBar position="static">
        <Toolbar>
          {onBack ? back : logo}

          <FlexSpace />
          {/* TODO: Show help! */}
          {/*<AppBarMenu />*/}
        </Toolbar>
      </StyledMuiAppBar>
    </>
  );
};

export default AppBar;
