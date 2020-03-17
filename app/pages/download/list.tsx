import { default as React, useState, useEffect, useMemo, FC } from "react";

import { NextPage } from "next";

import { CircularProgress, Container, Grid } from "@material-ui/core";

import useDownloadCodeVerifier from "../../components/hooks/useDownloadCodeVerifier";

import AppBar from "../../components/organisms/AppBar/DownloadAppBar";
import Footer from "../../components/organisms/Footer";
import ImpressionForm from "../../components/organisms/ImpressionForm";
import ProductDetail from "../../components/organisms/ProductDetail";
import ProductFileDownloaderTable from "../../components/organisms/ProductFileDownloaderTable";
import ActivatedProductList from "../../components/organisms/ActivatedProductList";

import { Product } from "../../domains/Product";

const ProgressContent: FC = () => (
  <Grid container={true} justify={"center"}>
    <CircularProgress />
  </Grid>
);

interface DetailPageProps {
  product: Product;
  downloadCodeExpiredAt: Date;
}

const ProductDetailContent: FC<DetailPageProps> = ({
  product,
  downloadCodeExpiredAt
}) => {
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    product.getIconUrl().then(url => {
      setIconUrl(url || "");
    });
  }, []);

  return (
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
  );
};

const DownloadProductListPage: NextPage = () => {
  const { actives } = useDownloadCodeVerifier();
  const [showingProductId, setShowingProductId] = useState<string | null>(null);

  const onBack = useMemo(() => {
    if (!showingProductId) {
      return;
    }

    return () => {
      setShowingProductId(null);
    };
  }, [showingProductId]);

  const onProductSelected = (selectedId: string) => {
    setShowingProductId(selectedId);
  };

  const main = useMemo(() => {
    if (actives === "processing") {
      return <ProgressContent />;
    }

    if (!showingProductId) {
      return (
        <ActivatedProductList
          products={actives.map(a => a.product)}
          onPanelClicked={onProductSelected}
        />
      );
    }

    const showingActiveProduct = actives.find(
      ({ product }) => product.id === showingProductId
    );

    if (!showingActiveProduct) {
      return;
    }

    const { product: showingProduct, expiredAt } = showingActiveProduct;

    return (
      <ProductDetailContent
        product={showingProduct}
        downloadCodeExpiredAt={expiredAt}
      />
    );
  }, [actives, showingProductId]);

  return (
    <>
      <Grid container={true} direction="column" style={{ minHeight: "100vh" }}>
        <Grid item={true}>
          <AppBar onBack={onBack} />
        </Grid>

        <Grid item={true}>
          <Container style={{ marginTop: 30, marginBottom: 30 }}>
            {main}
          </Container>
        </Grid>

        <Grid item={true} style={{ marginTop: "auto" }}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
};

export default DownloadProductListPage;
