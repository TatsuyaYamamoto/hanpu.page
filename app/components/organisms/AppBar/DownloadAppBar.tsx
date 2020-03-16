import { default as React, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  default as MuiAppBar,
  AppBarProps as MuiAppBarProps
} from "@material-ui/core/AppBar";
import {
  Toolbar,
  Typography,
  Icon,
  IconButton,
  Tabs,
  Tab,
  Button
} from "@material-ui/core";

import styled from "styled-components";

import FlexSpace from "../../atoms/FlexSpace";
import Logo from "../../atoms/Logo";
import useDlCodeUser from "../../hooks/useDlCodeUser";
import useAuth0 from "../../hooks/useAuth0";
import UserIconMenu from "./UserIconMenu";

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
  const { loginWithRedirect, logout } = useAuth0();
  const { user, sessionState } = useDlCodeUser();
  const router = useRouter();

  const [tabValue, setTabValue] = useState<TabValue>(() => {
    if (router.pathname.startsWith(`/download/list`)) {
      return "list";
    }
    return "verify";
  });

  const back = (
    <IconButton color="inherit" onClick={onBack}>
      <Icon>arrow_back</Icon>
    </IconButton>
  );

  const onClickLogin = () => {
    return loginWithRedirect();
  };

  const onClickLogout = () => {
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

  const userIcon =
    sessionState === "processing" ? (
      <></>
    ) : user ? (
      <UserIconMenu iconUrl={user.iconUrl} onLogoutClicked={onClickLogout} />
    ) : (
      <Button
        variant="contained"
        color="primary"
        disableElevation={true}
        onClick={onClickLogin}
      >
        ログイン
      </Button>
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
