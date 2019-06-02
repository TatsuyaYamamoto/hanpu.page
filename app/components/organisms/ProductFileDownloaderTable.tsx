import * as React from "react";

import DownloadIcon from "@material-ui/icons/ArrowDownward";
import PlayIcon from "@material-ui/icons/PlayArrow";

import MaterialTable from "material-table";

import { Product, ProductFile } from "../../domains/Product";
import { formatFileSize } from "../../utils/format";

interface ProductFileDownloaderTableProps {
  files: { [id: string]: ProductFile };
}
const ProductFileDownloaderTable: React.FC<ProductFileDownloaderTableProps> = ({
  files
}) => {
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

export default ProductFileDownloaderTable;
