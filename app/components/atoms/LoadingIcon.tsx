import * as React from "react";
import styled from "styled-components";

import RefreshIcon from "@material-ui/icons/Refresh";

interface Props {
  animation?: boolean;
}

// TODO: resolve types
const AnimatedRefreshIcon = styled<any>(RefreshIcon)`
  animation: spin 1.5s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingIcon: React.FC<Props> = props => {
  const { animation } = props;

  return animation ? <AnimatedRefreshIcon /> : <RefreshIcon />;
};

export default LoadingIcon;
