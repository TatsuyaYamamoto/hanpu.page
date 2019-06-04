import * as React from "react";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Icon, { IconProps } from "@material-ui/core/Icon";

import styled from "styled-components";

import LinkButton from "../atoms/LinkButton";
import Logo from "../atoms/Logo";
import Footer from "../organisms/Footer";

const Root = styled.div``;

const LeftIcon: React.FC<IconProps> = styled(Icon)`
  margin-right: ${({ theme }) => theme.spacing(1)}px;
`;

const Space = styled.div`
  height: 100px;
`;

const Hero = () => {
  return (
    <Grid item={true}>
      <Typography variant="h1">
        <Logo />
      </Typography>

      <LinkButton to="/d">
        <LeftIcon>cloud_download</LeftIcon>
        <span>ダウンロードページへ</span>
      </LinkButton>
      <LinkButton disabled={true} to="/">
        <LeftIcon>publish</LeftIcon>
        <span>配信管理ページへ</span>
      </LinkButton>
    </Grid>
  );
};

const AboutAppSection = () => {
  const logo = <Logo />;
  const book = <Icon>book</Icon>;
  const disk = <Icon>album</Icon>;

  return (
    <Grid item={true}>
      <Typography variant="h5">なにができるの？</Typography>
      <Typography variant="body1">
        <span>
          {logo}は、ダウンロードコードを使った作品配信が行えるアプリです。
          {book}本や、{disk}
          CDに収録しきれないコンテンツはダウンロード配信しましょう。
        </span>
      </Typography>
    </Grid>
  );
};

const RootPage = () => {
  return (
    <Root>
      <Grid
        container={true}
        direction={"column"}
        style={{ minHeight: "100vh" }}
      >
        <Container>
          <Hero />

          <Space />

          <AboutAppSection />
        </Container>

        <Grid item={true} style={{ marginTop: "auto" }}>
          <Footer />
        </Grid>
      </Grid>
    </Root>
  );
};

export default RootPage;
