import * as React from "react";
const { useState, useMemo } = React;
import { RouteComponentProps } from "react-router-dom";

import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import useDownloadCodeVerifier from "../../hooks/useDownloadCodeVerifier";
import AppBar from "../../organisms/AppBar";
import ProductFileDownloaderTable from "../../organisms/ProductFileDownloaderTable";
import ActivatedProductList from "../../organisms/ActivatedProductList";

import { Product } from "../../../domains/Product";

interface DetailPageProps {
  product: Product;
  onBack: () => void;
}

const DetailPage: React.FC<DetailPageProps> = ({ product, onBack }) => {
  return (
    <>
      <AppBar title={"DownloadDashboard"} onBack={onBack} />
      <Container>
        <Box>
          <Box>
            <Box>
              <img src={""} />
            </Box>

            <Box>
              <Typography>{product.name}</Typography>
              <Typography>{product.description}</Typography>
            </Box>
          </Box>
          <Box>
            <ProductFileDownloaderTable files={product.productFiles} />
          </Box>
        </Box>
      </Container>
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
      <AppBar title={"DownloadDashboard"} />
      <Container>
        <ActivatedProductList
          products={products}
          onPanelClicked={onPanelClicked}
        />
      </Container>
    </>
  );
};

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
