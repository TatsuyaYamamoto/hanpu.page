import * as React from "react";

import styled from "styled-components";
import Typography from "@material-ui/core/Typography";

const Root = styled.div`
  background-color: #1da1f2;

  display: flex;
  align-items: center;
  justify-items: center;
`;

const LoginCommunication: React.FunctionComponent = props => {
  const { ...others } = props;
  return (
    <Root {...others}>
      <Typography>hoge</Typography>
      <Typography>fuga</Typography>
      <Typography>chun</Typography>
    </Root>
  );
};

export default LoginCommunication;
