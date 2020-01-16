import * as React from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import AppBar from "../../../components/organisms/AppBar";
import Footer from "../../../components/organisms/Footer";
import ProductEditForm from "../../../components/organisms/ProductEditForm";

const ProductDetailPage: NextPage<{ productId: string }> = ({ productId }) => {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

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

ProductDetailPage.getInitialProps = ({ query }) => {
  const productId = query.productId as string;

  return {
    productId
  };
};

export default ProductDetailPage;
