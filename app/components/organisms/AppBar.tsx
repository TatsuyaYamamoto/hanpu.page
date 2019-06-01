import * as React from "react";
const { useState } = React;

import { auth } from "firebase/app";

import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import styled from "styled-components";

const Space = styled.div`
  flex-grow: 1;
`;

interface AppBarProps {
  title: string;
  onBack?: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ title, onBack }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const logout = () => {
    auth().signOut();
  };

  return (
    <>
      <MuiAppBar position="static">
        <Toolbar>
          {onBack && (
            <IconButton color="inherit" onClick={onBack}>
              <Icon>arrow_back</Icon>
            </IconButton>
          )}

          <Typography variant="h6" color="inherit">
            {title}
          </Typography>

          <Space />

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
      </MuiAppBar>
    </>
  );
};

export default AppBar;
