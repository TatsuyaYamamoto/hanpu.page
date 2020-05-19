import * as React from "react";

import styled from "styled-components";

import AppBar from "../organisms/AppBar";
import DownloadCodeCheckCamera from "../organisms/DownloadCodeCheckCamera";

const Root = styled.div``;

// TODO set GA Event
class CheckPage extends React.Component<{}, {}> {
  public render() {
    return (
      <>
        <Root>
          <AppBar />
          <DownloadCodeCheckCamera />
        </Root>
      </>
    );
  }
}

export default CheckPage;
