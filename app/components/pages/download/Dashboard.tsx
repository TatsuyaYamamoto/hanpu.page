import * as React from "react";
const { useState, useEffect, useMemo } = React;

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import useDownloadCodeVerifier from "../../hooks/useDownloadCodeVerifier";
import useGa from "../../hooks/useGa";
import AppBar from "../../organisms/AppBar";
import Footer from "../../organisms/Footer";
import ProductDetail from "../../organisms/ProductDetail";
import ProductFileDownloaderTable from "../../organisms/ProductFileDownloaderTable";
import ActivatedProductList from "../../organisms/ActivatedProductList";

import { Product } from "../../../domains/Product";

interface DetailPageProps {
  product: Product;
  downloadCodeExpiredAt: Date;
  onBack: () => void;
}

const DetailPage: React.FC<DetailPageProps> = ({
  product,
  downloadCodeExpiredAt,
  onBack
}) => {
  const [iconUrl, setIconUrl] = useState("");
  const { gtagPageView } = useGa();

  useEffect(() => {
    // TODO: handle with react-router-props
    gtagPageView("/d/dashboard/detail");

    product.getIconUrl().then(url => {
      setIconUrl(url || "");
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
                  downloadCodeExpiredAt={downloadCodeExpiredAt}
                />
              </Grid>
              <Grid item={true}>
                <ProductFileDownloaderTable
                  files={product.productFiles}
                  productId={product.id}
                />
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
  const { gtagPageView } = useGa();

  useEffect(() => {
    // TODO: handle with react-router-props
    gtagPageView("/d/dashboard/panel");
  }, []);

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
const DownloadDashboardPage: React.FC = () => {
  const { actives } = useDownloadCodeVerifier();
  const [selected, setSelected] = useState<{
    product: Product;
    expiredAt: Date;
  } | null>(null);

  const onProductSelected = (selectedId: string) => {
    const activeProduct = actives.find(
      ({ product }) => product.id === selectedId
    );

    if (activeProduct) {
      setSelected({
        product: activeProduct.product,
        expiredAt: activeProduct.expiredAt
      });
    }
  };

  const products = useMemo(() => {
    return actives.map(a => a.product);
  }, [actives]);

  const showList = () => {
    setSelected(null);
  };

  if (selected) {
    return (
      <DetailPage
        product={selected.product}
        downloadCodeExpiredAt={selected.expiredAt}
        onBack={showList}
      />
    );
  }

  return <PanelPage products={products} onPanelClicked={onProductSelected} />;
};

export default DownloadDashboardPage;
