import * as React from "react";

import Grid from "@material-ui/core/Grid";
import styled from "styled-components";

import LinkButton from "../atoms/LinkButton";
import Logo from "../atoms/Logo";

import config from "../../configs";

const copyRightSymbol = `\u00A9`;

const CopyRight = styled.span`
  color: whitesmoke;
`;

const StyledLinkButton = styled(LinkButton)`
  && {
    color: whitesmoke;
  }
`;

const Root = styled.div`
  background-color: grey;
`;

const Footer: React.FC = () => {
  const contact = (
    <StyledLinkButton to={config.contactFormUrl}>お問い合わせ</StyledLinkButton>
  );

  const dlCode = (
    <StyledLinkButton to={`/`}>
      <Logo />
    </StyledLinkButton>
  );

  const twitter = (
    <StyledLinkButton to={config.twitterUrl}>Twitter</StyledLinkButton>
  );

  const copyRight = <CopyRight>{copyRightSymbol} 2019 DBCode</CopyRight>;

  return (
    <Root>
      <Grid container={true} justify="space-around" alignItems="center">
        {contact}
        {dlCode}
        {twitter}
      </Grid>
      <Grid container={true} justify="space-around" alignItems="center">
        {copyRight}
      </Grid>
    </Root>
  );
};

export default Footer;
