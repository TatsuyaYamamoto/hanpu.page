import { default as React, useState, useEffect, useCallback } from "react";

import { NextPage } from "next";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import useAuth0 from "../../../components/hooks/useAuth0";

import AppBar from "../../../components/organisms/AppBar";
import Footer from "../../../components/organisms/Footer";
import ProductList from "../../../components/organisms/ProductList";
import ProductAddDialog from "../../../components/organisms/ProductAddDialog";

const ProductListPage: NextPage = () => {
  const {
    idToken,
    initialized: isAuth0Initialized,
    loginWithRedirect
  } = useAuth0();
  const [isAddDialogOpened, setAddDialogOpened] = useState(false);

  const handleAddDialog = useCallback(() => {
    setAddDialogOpened(!isAddDialogOpened);
  }, [isAddDialogOpened]);

  const handleAddProductSubmit = (creationPromise: Promise<any>) => {
    creationPromise.then(() => {
      handleAddDialog();
    });
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
            <ProductList />

            <Fab onClick={handleAddDialog}>
              <AddIcon />
            </Fab>
          </Container>
        </Grid>

        <Grid item={true} style={{ marginTop: "auto" }}>
          <Footer />
        </Grid>
      </Grid>

      <ProductAddDialog
        open={isAddDialogOpened}
        handleClose={handleAddDialog}
        onSubmit={handleAddProductSubmit}
      />
    </>
  );
};

export default ProductListPage;
