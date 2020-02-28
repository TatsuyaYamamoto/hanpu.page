import { default as React, useEffect } from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import AppBar from "../../../components/organisms/AppBar";
import Footer from "../../../components/organisms/Footer";
import ProductEditForm from "../../../components/organisms/ProductEditForm";
import useAuth0 from "../../../components/hooks/useAuth0";

const ProductDetailPage: NextPage<{ productId: string }> = ({ productId }) => {
  const {
    idToken,
    initialized: isAuth0Initialized,
    loginWithRedirect
  } = useAuth0();
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

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

ProductDetailPage.getInitialProps = ({ query }) => {
  const productId = query.productId as string;

  return {
    productId
  };
};

export default ProductDetailPage;
