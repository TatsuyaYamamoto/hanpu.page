import { default as React, useEffect } from "react";

import { NextPage } from "next";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import useAuth0 from "../../../components/hooks/useAuth0";

import AppBar from "../../../components/organisms/AppBar";
import Footer from "../../../components/organisms/Footer";
import ProductList from "../../../components/organisms/ProductList";

const ProductListPage: NextPage = () => {
  const {
    idToken,
    initialized: isAuth0Initialized,
    loginWithRedirect
  } = useAuth0();

  useEffect(() => {
    if (!isAuth0Initialized) {
      return;
    }

    if (!idToken) {
      const { origin, href } = location;
      loginWithRedirect({
        redirect_uri: `${origin}/callback?to=${href}`
      });
    }
  }, [idToken, isAuth0Initialized, loginWithRedirect]);

  return (
    <>
      <Grid container={true} direction="column" style={{ minHeight: "100vh" }}>
        <Grid item={true}>
          <AppBar showTabs={true} />
        </Grid>

        <Grid item={true}>
          <Container style={{ marginTop: 30, marginBottom: 30 }}>
            <ProductList />
          </Container>
        </Grid>

        <Grid item={true} style={{ marginTop: "auto" }}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
};

export default ProductListPage;
