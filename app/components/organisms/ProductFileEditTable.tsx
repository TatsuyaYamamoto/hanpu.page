import * as React from "react";

import MaterialTable from "material-table";

import ProductFileAddDialog from "./ProductFileAddDialog";

import { Product, ProductFile } from "../../domains/Product";

interface InnerTableProps {
  productFiles: { [id: string]: ProductFile };
  onAddButtonClicked: () => void;
  onDeleteRequested: (productFileId: string, resolve: () => void) => void;
}

const InnerTable: React.FC<InnerTableProps> = ({
  productFiles,
  onAddButtonClicked,
  onDeleteRequested
}) => {
  const data = Object.keys(productFiles).map(id => ({
    id,
    displayName: productFiles[id].displayName,
    originalName: productFiles[id].originalName,
    size: productFiles[id].size,
    contentType: productFiles[id].contentType
  }));

  return (
    <MaterialTable
      options={{
        showTitle: false,
        addRowPosition: "first",
        paging: false,
        search: false,
        actionsColumnIndex: -1
      }}
      localization={{
        header: {
          actions: ""
        },
        body: {
          editRow: {
            deleteText: "けします"
          }
        }
      }}
      columns={[
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
      ]}
      data={data}
      actions={[
        // TODO ダウンロードアイコンの場所の調整。
        // <EDIT><DELETE><DL>ではなくて、<DL><EDIT><DELETE>にする。
        {
          icon: "arrow_downward",
          tooltip: "Download",
          onClick: (event, rowData) => alert(`You saved ${rowData.name}`)
        },
        {
          icon: "add",
          tooltip: "追加",
          isFreeAction: true,
          onClick: onAddButtonClicked
        }
      ]}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const updated = [...data];
              updated[updated.indexOf(oldData)] = newData;
              // setData(updated);
            }, 600);
          }),
        onRowDelete: ({ id }) => {
          return new Promise(resolve => {
            onDeleteRequested(id, resolve);

            // setTimeout(() => {
            //   resolve();
            //   const updated = [...data];
            //   updated.splice(updated.indexOf(oldData), 1);
            //   // setData(updated);
            // }, 600);
          });
        }
      }}
    />
  );
};

interface ProductFileEditTableProps {
  product: Product;
}

const ProductFileEditTable: React.FC<ProductFileEditTableProps> = ({
  product
}) => {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [productFiles, setProductFiles] = React.useState<{
    [id: string]: ProductFile;
  }>({});

  const handleProductFileAddDialog = () => {
    setAddDialogOpen(!addDialogOpen);
  };

  const onProductFileAdded = async (displayFileName: string, file: File) => {
    const { task, promise } = await product.addProductFile(
      displayFileName,
      file
    );

    const updatedProduct = await promise;

    setProductFiles(updatedProduct.productFiles);
    handleProductFileAddDialog();
  };

  const onProductFileDeleted = async (id: string, resolve: () => void) => {
    const updatedProduct = await product.deleteProductFile(id);

    setProductFiles(updatedProduct.productFiles);

    resolve();
  };

  React.useEffect(() => {
    setProductFiles(product.productFiles);
  }, []);

  return (
    <>
      <InnerTable
        productFiles={productFiles}
        onAddButtonClicked={handleProductFileAddDialog}
        onDeleteRequested={onProductFileDeleted}
      />
      <ProductFileAddDialog
        open={addDialogOpen}
        handleClose={handleProductFileAddDialog}
        onSubmit={onProductFileAdded}
      />
    </>
  );
};

export default ProductFileEditTable;
