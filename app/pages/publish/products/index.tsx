import * as React from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import AppBar from "../../../components/organisms/AppBar";
import Footer from "../../../components/organisms/Footer";

import { Product } from "../../../domains/Product";

const ProductListPage: NextPage = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    // TODO delete this logic!!
    setTimeout(() => {
      Product.getOwns().then(owns => {
        // TODO
        // tslint:disable:no-console
        console.log(owns);
        setProducts(owns);
      });
    }, 1000);
  }, []);

  const onSelected = (id: string) => () => {
    router.push(`/publish/products/${id}`);
  };

  return (
    <>
      <Grid container={true} direction="column" style={{ minHeight: "100vh" }}>
        <Grid item={true}>
          <AppBar />
        </Grid>

        <Grid item={true}>
          <Container style={{ marginTop: 30, marginBottom: 30 }}>
            <ul>
              {products.map(p => {
                return (
                  <li key={p.name} onClick={onSelected(p.id)}>
                    name: <div>{p.name}</div>
                    desc: <div>{p.description}</div>
                    created: <div>{p.createdAt.toDateString()}</div>
                  </li>
                );
              })}
            </ul>
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
