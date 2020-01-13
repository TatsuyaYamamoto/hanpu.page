import * as React from "react";

import { Container, Grid, Typography } from "@material-ui/core";
import Icon, { IconProps } from "@material-ui/core/Icon";

import styled from "styled-components";

import LinkButton from "../atoms/LinkButton";
import Logo from "../atoms/Logo";
import Footer from "../organisms/Footer";

const Root = styled.div``;

const LeftIcon = styled(Icon as React.FC<IconProps>)`
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

      <LinkButton href="/d">
        <LeftIcon>cloud_download</LeftIcon>
        <span>ダウンロードページへ</span>
      </LinkButton>
      <LinkButton disabled={true} href="/">
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
  const { formattedNow } = useDate();
  const now = formattedNow("yyyy/mm/dd");
  const t28Link = <a href={`https://twitter.com/T28_tatsuya`}>@T28_tatsuya</a>;

  return (
    <>
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
      <Space />
      <Grid item={true}>
        <Typography variant="h5">だれが使えるの？</Typography>
        <Typography variant="h6">ダウンロード</Typography>
        <Typography variant="body1">
          <span>>> 誰でも！</span>
        </Typography>
        <Typography variant="h6">ファイル配信</Typography>
        <Typography variant="body1">
          >> {now}時点では、{t28Link}のみです。
        </Typography>
      </Grid>
    </>
  );
};

const RootPage = () => {
  // TODO
  // const { gtagPageView } = useGa();
  // useEffect(() => {
  //   gtagPageView(props.location.pathname);
  // }, []);

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
