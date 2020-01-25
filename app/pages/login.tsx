import * as React from "react";
const { useEffect } = React;

import { NextPage } from "next";
import { useRouter } from "next/router";

import styled from "styled-components";
import { Grid, Container } from "@material-ui/core";

import useFirebase from "../components/hooks/useFirebase";
import LoginForm from "../components/organisms/LoginForm";
import Footer from "../components/organisms/Footer";

const StyledForm = styled(LoginForm as React.FC)`
  margin: 10% auto 30px;
`;

const LoginPage: NextPage = () => {
  const { user } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(`/publish/products`);
    }
  }, [user]);

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
