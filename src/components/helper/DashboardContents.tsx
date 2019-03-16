import * as React from "react";

import styled from "styled-components";

const Root = styled.main``;

const DashboardContents: React.FunctionComponent = props => {
  const { children, ...others } = props;

  return (
    <Root {...others}>
      {children}
    </Root>
  );
};

export default DashboardContents;
