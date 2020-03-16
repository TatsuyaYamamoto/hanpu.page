import { default as React } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  default as MuiAppBar,
  AppBarProps as MuiAppBarProps
} from "@material-ui/core/AppBar";
import {
  Avatar,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab
} from "@material-ui/core";
import LogoutIcon from "@material-ui/icons/ExitToApp";

import styled from "styled-components";

import FlexSpace from "../../atoms/FlexSpace";
import Logo from "../../atoms/Logo";
import useDlCodeUser from "../../hooks/useDlCodeUser";
import useAuth0 from "../../hooks/useAuth0";

const StyledMuiAppBar = styled(MuiAppBar as React.FC<MuiAppBarProps>)`
  && {
    background-color: transparent;
    color: grey;
    z-index: 99;
  }
`;

const LogoLink = styled(({ className }) => (
  <Link href={`/`}>
    <Typography variant="h6" color="inherit" className={className}>
      <Logo />
    </Typography>
  </Link>
))`
  cursor: pointer;
`;

type TabValue = "verify" | "list";

interface AppBarProps {
  onBack?: () => void;
}

const AppBar: React.FC<AppBarProps> = props => {
  const { onBack } = props;
  const { logout } = useAuth0();
  const { user } = useDlCodeUser();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tabValue, setTabValue] = React.useState<TabValue>(() => {
    if (router.pathname.startsWith(`/download/list`)) {
      return "list";
    }
    return "verify";
  });

  const open = Boolean(anchorEl);

  const back = (
    <IconButton color="inherit" onClick={onBack}>
      <Icon>arrow_back</Icon>
    </IconButton>
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
      case "verify":
        router.push(`/download/verify`);
        break;
      case "list":
        router.push(`/download/list`);
        break;
    }
  };

  const menuTabs = (
    <Tabs value={tabValue} onChange={onTabMenuChanged}>
      <Tab label="コード入力" value={"verify"} />
      <Tab label="リスト" value={"list"} />
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
          {onBack ? back : <LogoLink />}
          <>
            <FlexSpace />
            {menuTabs}
            {userIcon}
          </>
        </Toolbar>
      </StyledMuiAppBar>
    </>
  );
};

export default AppBar;
