import * as React from "react";
import { useRouter } from "next/router";

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
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import LogoutIcon from "@material-ui/icons/ExitToApp";

import styled from "styled-components";

import FlexSpace from "../atoms/FlexSpace";
import Logo from "../atoms/Logo";
import useDlCodeUser from "../hooks/useDlCodeUser";
import useAuth0 from "../hooks/useAuth0";

const StyledMuiAppBar = styled(MuiAppBar as React.FC<MuiAppBarProps>)`
  && {
    background-color: transparent;
    color: grey;
    z-index: 99;
  }
`;

type TabValue = "home" | "product";

interface AppBarProps {
  showTabs: boolean;
  onBack?: () => void;
}

const AppBar: React.FC<AppBarProps> = props => {
  const { showTabs, onBack } = props;
  const { logout } = useAuth0();
  const { user } = useDlCodeUser();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tabValue, setTabValue] = React.useState<TabValue>(() => {
    if (router.pathname.startsWith(`/publish/products`)) {
      return "product";
    }
    return "home";
  });

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

  const onClickLogout = () => {
    handleMenu();
    logout();
  };

  const onTabMenuChanged = (_: React.ChangeEvent<{}>, newValue: TabValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case "home":
        router.push(`/publish`);
        break;
      case "product":
        router.push(`/publish/products`);
        break;
    }
  };

  const menuTabs = (
    <Tabs value={tabValue} onChange={onTabMenuChanged}>
      <Tab label="ホーム" value={"home"} />
      <Tab label="プロダクト" value={"product"} />
    </Tabs>
  );
  const userIcon = user ? (
    <>
      <IconButton onClick={handleMenu}>
        <Avatar src={user && user.iconUrl} />
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
        <MenuItem onClick={onClickLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={`ログアウト`} />
        </MenuItem>
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
          {showTabs && (
            <>
              <FlexSpace />
              {menuTabs}
              {userIcon}
            </>
          )}
        </Toolbar>
      </StyledMuiAppBar>
    </>
  );
};

export default AppBar;
