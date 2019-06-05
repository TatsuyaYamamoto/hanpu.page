import * as React from "react";
const { useState } = React;

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

const StyledMuiAppBar: React.FC<MuiAppBarProps> = styled(MuiAppBar)`
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const { logout } = useAuthSession();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

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
              <MenuItem onClick={logout}>ログアウト</MenuItem>
            </Menu>
          </>
        </Toolbar>
      </StyledMuiAppBar>
    </>
  );
};

export default AppBar;
