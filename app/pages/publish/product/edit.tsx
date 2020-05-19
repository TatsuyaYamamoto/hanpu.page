import { default as React, useEffect } from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import AppBar from "../../../components/organisms/AppBar/PublishAppBar";
import Footer from "../../../components/organisms/Footer";
import ProductEditForm from "../../../components/organisms/ProductEditForm";
import useAuth0 from "../../../components/hooks/useAuth0";

const ProductEditPage: NextPage = () => {
  const {
    idToken,
    initialized: isAuth0Initialized,
    loginWithRedirect
  } = useAuth0();
  const router = useRouter();
  const productId = router.query.id as string;

  const onBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!isAuth0Initialized) {
      return;
    }

    if (!idToken) {
      loginWithRedirect();
    }
  }, [idToken, isAuth0Initialized, loginWithRedirect]);

  return (
    <>
      <Grid container={true} direction="column" style={{ minHeight: "100vh" }}>
        <Grid item={true}>
          <AppBar onBack={onBack} />
        </Grid>

        <Grid item={true}>
          <Container style={{ marginTop: 30, marginBottom: 30 }}>
            <ProductEditForm productId={productId} />
          </Container>
        </Grid>

        <Grid item={true} style={{ marginTop: "auto" }}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
};

export default ProductEditPage;
