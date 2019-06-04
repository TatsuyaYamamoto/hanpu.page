import * as React from "react";

import Grid from "@material-ui/core/Grid";
import styled from "styled-components";

import LinkButton from "../atoms/LinkButton";

const LinkSection = () => (
  <>
    <LinkButton to={`/`}>お問い合わせ</LinkButton>
    <LinkButton to={`/`}>DLCode</LinkButton>
    <LinkButton to={`/`}>Twitter</LinkButton>
  </>
);

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
  return (
    <Root>
      <Grid container={true} justify="space-around" alignItems="center">
        <StyledLinkButton to={`/`}>お問い合わせ</StyledLinkButton>
        <StyledLinkButton to={`/`}>DLCode</StyledLinkButton>
        <StyledLinkButton to={`/`}>Twitter</StyledLinkButton>
      </Grid>
      <Grid container={true} justify="space-around" alignItems="center">
        <CopyRight>{copyRightSymbol} 2019 DBCode</CopyRight>
      </Grid>
    </Root>
  );
};

export default Footer;
