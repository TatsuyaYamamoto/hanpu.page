import { default as React, FC, useState, ChangeEvent } from "react";
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
  Tab
} from "@material-ui/core";

import styled from "styled-components";

import UserIconMenu from "./UserIconMenu";

import FlexSpace from "../../atoms/FlexSpace";
import Logo from "../../atoms/Logo";
import useDlCodeUser from "../../hooks/useDlCodeUser";
import useAuth0 from "../../hooks/useAuth0";

const StyledMuiAppBar = styled(MuiAppBar as FC<MuiAppBarProps>)`
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

const tabs = [
  {
    value: "home",
    url: `/publish`,
    label: "ホーム",
    match: (path: string) => path === `/publish`
  },
  {
    value: "product",
    url: `/publish/product/list`,
    label: "プロダクト",
    match: (path: string) => path.startsWith(`/publish/product`)
  },
  {
    value: "analytics",
    url: `/publish/analytics`,
    label: "アナリティクス",
    match: (path: string) => path === `/publish/analytics`
  }
] as const;

type TabValue = typeof tabs[number]["value"];

interface AppBarProps {
  onBack?: () => void;
}

const AppBar: FC<AppBarProps> = props => {
  const { onBack } = props;
  const { logout } = useAuth0();
  const { user } = useDlCodeUser();
  const router = useRouter();

  const [tabValue, setTabValue] = useState<TabValue>(() => {
    const currentTab = tabs.find(tab => tab.match(router.pathname));

    if (currentTab) {
      return currentTab.value;
    }

    return "home";
  });

  const back = (
    <IconButton color="inherit" onClick={onBack}>
      <Icon>arrow_back</Icon>
    </IconButton>
  );

  const onClickLogout = () => {
    logout();
  };

  const onTabMenuChanged = (_: ChangeEvent<{}>, newValue: TabValue) => {
    setTabValue(newValue);
    const nextTab = tabs.find(tab => tab.value === newValue);

    if (nextTab) {
      router.push(nextTab.url);
    }
  };

  const menuTabs = (
    <Tabs value={tabValue} onChange={onTabMenuChanged}>
      {tabs.map(tab => (
        <Tab key={tab.value} label={tab.label} value={tab.value} />
      ))}
    </Tabs>
  );

  const userIcon = user ? (
    <UserIconMenu iconUrl={user.iconUrl} onLogoutClicked={onClickLogout} />
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
