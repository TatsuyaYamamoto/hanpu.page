import * as React from "react";
const { useState, useEffect, useMemo } = React;

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import useDownloadCodeVerifier from "../../components/hooks/useDownloadCodeVerifier";
import AppBar from "../../components/organisms/AppBar";
import Footer from "../../components/organisms/Footer";
import ImpressionForm from "../../components/organisms/ImpressionForm";
import ProductDetail from "../../components/organisms/ProductDetail";
import ProductFileDownloaderTable from "../../components/organisms/ProductFileDownloaderTable";
import ActivatedProductList from "../../components/organisms/ActivatedProductList";

import { Product } from "../../domains/Product";

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

  useEffect(() => {
    product.getIconUrl().then(url => {
      setIconUrl(url || "");
    });
  }, []);

  return (
    <>
      <Grid container={true} direction="column" style={{ minHeight: "100vh" }}>
        <Grid item={true}>
          <AppBar showTabs={false} onBack={onBack} />
        </Grid>

        <Grid item={true}>
          <Container style={{ marginTop: 30, marginBottom: 30 }}>
            <Grid container={true} direction={"column"} spacing={5}>
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

              <Grid item={true}>
                <ImpressionForm productId={product.id} />
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
          <AppBar showTabs={false} />
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
