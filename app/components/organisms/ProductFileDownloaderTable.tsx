import * as React from "react";

import DownloadIcon from "@material-ui/icons/ArrowDownward";
import PlayIcon from "@material-ui/icons/PlayArrow";

import MaterialTable from "material-table";
import { storage } from "firebase";

import { Product, ProductFile } from "../../domains/Product";
import { formatFileSize } from "../../utils/format";
import { downloadFromFirebaseStorage } from "../../utils/network";

interface ProductFileDownloaderTableProps {
  files: { [id: string]: ProductFile };
}
const ProductFileDownloaderTable: React.FC<ProductFileDownloaderTableProps> = ({
  files
}) => {
  const data = Object.keys(files).map(id => {
    const productFile = files[id];
    return {
      id,
      name: productFile.displayName,
      contentType: productFile.contentType,
      size: formatFileSize(productFile.size)
    };
  });

  const onDownloadClicked = async (id: string) => {
    const { storageUrl, originalName } = files[id];
    downloadFromFirebaseStorage(storageUrl, originalName);
  };

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
          onClick: (event, { id }) => onDownloadClicked(id)
        }
      ]}
    />
  );
};

export default ProductFileDownloaderTable;
