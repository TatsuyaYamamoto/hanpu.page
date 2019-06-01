import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DownloadIcon from "@material-ui/icons/ArrowDownward";
import PlayIcon from "@material-ui/icons/PlayArrow";

import MaterialTable from "material-table";
import { Product, ProductFile } from "../../../domains/Product";

import { DownloaderContext } from "../../utils/Downloader";

interface DownloaderTableProps {
  files: { [id: string]: ProductFile };
}
const DownloaderTable: React.FC<DownloaderTableProps> = ({ files }) => {
  const data = Object.keys(files).map(key => {
    const productFile = files[key];
    return {
      name: productFile.displayName,
      contentType: productFile.contentType,
      size: productFile.size
    };
  });

  return (
    <MaterialTable
      options={{
        showTitle: false,
        search: false,
        paging: false
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

interface DownloadProductPanelProps {
  product: Product;
}
const DownloadProductPanel: React.FC<DownloadProductPanelProps> = ({
  product
}) => {
  const [iconUrl, setIconUrl] = React.useState(null);

  React.useEffect(() => {
    product.getIconUrl().then(url => {
      setIconUrl(url);
    });
  }, []);

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{product.name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <img src={iconUrl} />
        <Typography>
          <div>{product.description}</div>
        </Typography>
        <DownloaderTable files={product.productFiles} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const DownloadDashboardPage: React.FC<
  RouteComponentProps<{ code?: string }>
> = props => {
  const { products } = React.useContext(DownloaderContext);

  return (
    <>
      DownloadDashboard
      <>
        {products.map(p => (
          <DownloadProductPanel key={p.id} product={p} />
        ))}
      </>
    </>
  );
};

export default DownloadDashboardPage;
