import * as React from "react";

import styled from "styled-components";

const Root = styled.div``;

const Footer: React.FunctionComponent = props => {
  const { ...others } = props;
  return <Root {...others}>さぽーと　ご要望</Root>;
};

export default Footer;
