import * as React from "react";
const { useEffect } = React;

import { NextPage } from "next";
import { useRouter } from "next/router";

import styled from "styled-components";
import { Grid, Container } from "@material-ui/core";

import useDlCodeUser from "../components/hooks/useDlCodeUser";

import LoginForm from "../components/organisms/LoginForm";
import Footer from "../components/organisms/Footer";

const StyledForm = styled(LoginForm as React.FC)`
  margin: 10% auto 30px;
`;

const LoginPage: NextPage = () => {
  const { sessionState } = useDlCodeUser();
  const router = useRouter();

  useEffect(() => {
    if (sessionState === "loggedIn") {
      const redirectPath = router.query.redirectTo;

      if (redirectPath && typeof redirectPath === "string") {
        router.push(redirectPath);
      } else {
        router.push(`/publish`);
      }
    }
  }, [sessionState]);

  return (
    <Grid container={true} direction={"column"} style={{ minHeight: "100vh" }}>
      <Container>
        <StyledForm />
      </Container>
      <Grid item={true} style={{ marginTop: "auto" }}>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
