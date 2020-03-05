import * as React from "react";
import { NextPage } from "next";

import styled from "styled-components";

import AppBar from "../components/organisms/AppBar";
import DownloadCodeCheckCamera from "../components/organisms/DownloadCodeCheckCamera";

const Root = styled.div``;

const CheckPage: NextPage = () => {
  return (
    <>
      <Root>
        <AppBar showTabs={false} />
        <DownloadCodeCheckCamera />
      </Root>
    </>
  );
};

export default CheckPage;
