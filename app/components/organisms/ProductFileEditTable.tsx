import * as React from "react";
const { useMemo } = React;

import MaterialTable, { Column, Options as TableOptions } from "material-table";

import ProductFileAddDialog from "./ProductFileAddDialog";

import {
  ProductFile,
  ProductFileDisplayName,
  ProductFileMap,
  ProductFileOriginalName
} from "../../domains/Product";

import { formatFileSize } from "../../utils/format";
import { downloadFromFirebaseStorage } from "../../utils/network";

const TABLE_OPTIONS: TableOptions = {
  addRowPosition: "first",
  paging: false,
  search: false,
  actionsColumnIndex: -1
};

const TABLE_LOCALIZATION = {
  header: {
    actions: ""
  },
  body: {
    editRow: {
      deleteText: "けします"
    }
  }
};

const TABLE_COLUMNS: Column[] = [
  { title: "表示ファイル名", field: "displayName" },
  {
    title: "オリジナルファイル名",
    field: "originalName",
    editable: "never"
  },
  {
    title: "サイズ",
    field: "size",
    editable: "never"
  },
  {
    title: "タイプ",
    field: "contentType",
    editable: "never"
  }
];

interface InnerTableProps {
  productFiles: { [id: string]: ProductFile };
  onAddButtonClicked: () => void;
  onUpdateRequested: (
    productFileId: string,
    edited: Partial<ProductFile>,
    resolve: () => void
  ) => void;
  onDeleteRequested: (productFileId: string, resolve: () => void) => void;
  onDownloadClicked: (productFileId: string) => void;
}

interface RowData {
  id: string;
  displayName: ProductFileDisplayName;
  originalName: ProductFileOriginalName;
  size: string;
  contentType: string;
}

interface ProductFileEditTableProps {
  productFiles: ProductFileMap;
  onAdd: (displayFileName: ProductFileDisplayName, file: File) => Promise<void>;
  onUpdate: (
    productFileId: string,
    edited: Partial<ProductFile>
  ) => Promise<void>;
  onDelete: (productFileId: string) => Promise<void>;
}

const ProductFileEditTable: React.FC<ProductFileEditTableProps> = ({
  productFiles,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);

  const handleProductFileAddDialog = () => {
    setAddDialogOpen(!addDialogOpen);
  };

  const onAddButtonClicked = () => {
    handleProductFileAddDialog();
  };

  const onNewProductFileSubmitted = async (
    displayFileName: ProductFileDisplayName,
    file: File
  ) => {
    await onAdd(displayFileName, file);
    handleProductFileAddDialog();
  };

  const onDownloadButtonClicked = (
    event: any,
    { id: productFileId }: RowData
  ) => {
    const { storageUrl, originalName } = productFiles[productFileId];
    downloadFromFirebaseStorage(storageUrl, originalName);
  };

  const onProductFileUpdate = (
    newData: RowData,
    oldData: RowData
  ): Promise<void> => {
    const { id } = newData;
    const edited: Partial<ProductFile> = {};

    if (newData.displayName !== oldData.displayName) {
      edited.displayName = newData.displayName;
    }

    return onUpdate(id, edited);
  };

  const onProductFileDelete = ({ id }: RowData): Promise<void> => {
    return onDelete(id);
  };

  const data: RowData[] = useMemo(() => {
    return Object.keys(productFiles).map(id => ({
      id,
      displayName: productFiles[id].displayName,
      originalName: productFiles[id].originalName,
      size: formatFileSize(productFiles[id].size),
      contentType: productFiles[id].contentType
    }));
  }, [productFiles]);

  const Container = (props: any) => <div {...props} />;

  return (
    <>
      <MaterialTable
        options={TABLE_OPTIONS}
        localization={TABLE_LOCALIZATION}
        columns={TABLE_COLUMNS}
        title={"配信ファイル一覧"}
        data={data}
        actions={[
          // TODO ダウンロードアイコンの場所の調整。
          // <EDIT><DELETE><DL>ではなくて、<DL><EDIT><DELETE>にする。
          {
            icon: "arrow_downward",
            tooltip: "Download",
            onClick: onDownloadButtonClicked
          },
          {
            icon: "add",
            tooltip: "追加",
            isFreeAction: true,
            onClick: onAddButtonClicked
          }
        ]}
        editable={{
          onRowUpdate: onProductFileUpdate,
          onRowDelete: onProductFileDelete
        }}
      />

      <ProductFileAddDialog
        open={addDialogOpen}
        handleClose={handleProductFileAddDialog}
        onSubmit={onNewProductFileSubmitted}
      />
    </>
  );
};

export default ProductFileEditTable;
