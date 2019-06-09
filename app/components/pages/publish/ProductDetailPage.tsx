import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import AppBar from "../../organisms/AppBar";
import Footer from "../../organisms/Footer";
import ProductEditForm from "../../organisms/ProductEditForm";

const ProductDetailPage: React.FC<
  RouteComponentProps<{ id: string }>
> = props => {
  const productId = props.match.params.id;

  const onBack = () => {
    props.history.goBack();
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

export default ProductDetailPage;
