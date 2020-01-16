import * as React from "react";
import styled from "styled-components";

import RefreshIcon from "@material-ui/icons/Refresh";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

interface Props {
  animation?: boolean;
}

const AnimatedRefreshIcon = styled(RefreshIcon as React.FC<SvgIconProps>)`
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
