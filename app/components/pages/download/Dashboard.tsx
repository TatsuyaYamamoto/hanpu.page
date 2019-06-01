import * as React from "react";
const { useState, useMemo } = React;
import { RouteComponentProps } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DownloadIcon from "@material-ui/icons/ArrowDownward";
import PlayIcon from "@material-ui/icons/PlayArrow";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import MaterialTable from "material-table";

import AppBar from "../../organisms/AppBar";
import useDownloadCodeVerifier from "../../hooks/useDownloadCodeVerifier";

import { Product, ProductFile } from "../../../domains/Product";
import { formatFileSize } from "../../../utils/format";

interface DownloaderTableProps {
  files: { [id: string]: ProductFile };
}
const DownloaderTable: React.FC<DownloaderTableProps> = ({ files }) => {
  const data = Object.keys(files).map(key => {
    const productFile = files[key];
    return {
      name: productFile.displayName,
      contentType: productFile.contentType,
      size: formatFileSize(productFile.size)
    };
  });

  return (
    <MaterialTable
      options={{
        showTitle: false,
        search: false,
        paging: false,
        actionsColumnIndex: -1
      }}
      columns={[
        { title: "名前", field: "name", sorting: true },
        { title: "タイプ", field: "contentType", sorting: true },
        {
          title: "サイズ",
          field: "size",
          type: "numeric",
          sorting: true
        }
      ]}
      data={data}
      actions={[
        row => {
          if (row.canPlay) {
            return {
              icon: () => <PlayIcon />,
              tooltip: "再生",
              onClick: () => void 0
            };
          }

          return null;
        },
        {
          icon: () => <DownloadIcon />,
          tooltip: "ダウンロード",
          onClick: () => void 0
        }
      ]}
    />
  );
};

interface DownloadProductDetailProps {
  product: Product;
}

const DownloadProductDetail: React.FC<DownloadProductDetailProps> = ({
  product
}) => {
  return (
    <Grid container={true}>
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
          <DownloaderTable files={product.productFiles} />
        </Box>
      </Box>
    </Grid>
  );
};

interface DownloadProductPanelProps {
  product: Product;
  onClick: (id: string) => void;
}
const DownloadProductPanel: React.FC<DownloadProductPanelProps> = ({
  product,
  onClick
}) => {
  const [iconUrl, setIconUrl] = React.useState(null);

  React.useEffect(() => {
    product.getIconUrl().then(url => {
      setIconUrl(url);
    });
  }, []);

  const onCardClicked = () => {
    onClick(product.id);
  };

  return (
    <Card>
      <CardActionArea onClick={onCardClicked}>
        <CardMedia
          component="img"
          title={product.name}
          height="140"
          image={iconUrl}
        />
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            {product.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
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

  const show = selectedProduct ? (
    <DownloadProductDetail product={selectedProduct} />
  ) : (
    activeProducts.map(p => {
      return (
        <DownloadProductPanel
          key={p.id}
          product={p}
          onClick={onProductSelected}
        />
      );
    })
  );

  return (
    <>
      <AppBar title={"DownloadDashboard"} />
      {show}
    </>
  );
};

export default DownloadDashboardPage;
