import * as React from "react";
const { useState, useEffect } = React;
import { RouteComponentProps } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import useDownloadCodeVerifier from "../../hooks/useDownloadCodeVerifier";
import AppBar from "../../organisms/AppBar";
import Footer from "../../organisms/Footer";
import ProductDetail from "../../organisms/ProductDetail";
import ProductFileDownloaderTable from "../../organisms/ProductFileDownloaderTable";
import ActivatedProductList from "../../organisms/ActivatedProductList";

import { Product } from "../../../domains/Product";

interface DetailPageProps {
  product: Product;
  onBack: () => void;
}

const DetailPage: React.FC<DetailPageProps> = ({ product, onBack }) => {
  const { name, description } = product;
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    product.getIconUrl().then(url => {
      setIconUrl(url);
    });
  }, []);

  return (
    <>
      <Grid container={true} direction="column" style={{ minHeight: "100vh" }}>
        <Grid item={true}>
          <AppBar onBack={onBack} />
        </Grid>

        <Grid item={true}>
          <Container style={{ marginTop: 30, marginBottom: 30 }}>
            <Grid container={true} direction={"column"}>
              <Grid item={true}>
                <ProductDetail
                  name={product.name}
                  description={product.description}
                  iconUrl={iconUrl}
                />
              </Grid>
              <Grid item={true}>
                <ProductFileDownloaderTable files={product.productFiles} />
              </Grid>
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

interface PanelPageProps {
  products: Product[];
  onPanelClicked: (selectedId: string) => void;
}

const PanelPage: React.FC<PanelPageProps> = ({ products, onPanelClicked }) => {
  return (
    <>
      <Grid container={true} direction="column" style={{ minHeight: "100vh" }}>
        <Grid item={true}>
          <AppBar />
        </Grid>

        <Grid item={true}>
          <Container style={{ marginTop: 30, marginBottom: 30 }}>
            <ActivatedProductList
              products={products}
              onPanelClicked={onPanelClicked}
            />
          </Container>
        </Grid>

        <Grid item={true} style={{ marginTop: "auto" }}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
};

// TODO: cache and reuse product thumbnail image.
const DownloadDashboardPage: React.FC<
  RouteComponentProps<{ code?: string }>
> = props => {
  const { activeProducts } = useDownloadCodeVerifier();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const onProductSelected = (selectedId: string) => {
    const product = activeProducts.find(({ id }) => id === selectedId);

    setSelectedProduct(product);
  };

  const showList = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return <DetailPage product={selectedProduct} onBack={showList} />;
  }

  return (
    <PanelPage products={activeProducts} onPanelClicked={onProductSelected} />
  );
};

export default DownloadDashboardPage;
