import { default as React, useEffect } from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import useFirebase from "../../components/hooks/useFirebase";
import useDlCodeUser from "../../components/hooks/useDlCodeUser";

import AppBar from "../../components/organisms/AppBar";
import Footer from "../../components/organisms/Footer";
import PublishUserProfile from "../../components/organisms/PublishUserProfile";

const PublishIndexPage: NextPage = () => {
  const { app: firebaseApp } = useFirebase();
  const { sessionState } = useDlCodeUser();
  const router = useRouter();

  useEffect(() => {
    if (!firebaseApp) {
      // firebase app has not been initialized.
      return;
    }

    if (sessionState === "loggedOut") {
      // TODO move redirect logic as common module.
      router.push(`/login?redirectTo=${router.pathname}`);
      return;
    }
  }, [firebaseApp, sessionState]);

  return (
    <>
      <Grid container={true} direction="column" style={{ minHeight: "100vh" }}>
        <Grid item={true}>
          <AppBar />
        </Grid>

        <Grid item={true}>
          <Container style={{ marginTop: 30, marginBottom: 30 }}>
            <Grid container={true}>
              <PublishUserProfile />
            </Grid>
          </Container>
        </Grid>

        <Grid item={true} style={{ marginTop: "auto" }}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
};

export default PublishIndexPage;
