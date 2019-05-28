import * as React from "react";

import MaterialTable from "material-table";

import { firestore, storage } from "firebase/app";

import ProductFileAddDialog from "./ProductFileAddDialog";

import { ProductFile } from "../../domains/ProductFile";
import { Product } from "../../domains/Product";

interface InnerTableProps {
  productFiles: ProductFile[];
  onAddButtonClicked: () => void;
}

const InnerTable: React.FC<InnerTableProps> = ({
  productFiles,
  onAddButtonClicked
}) => {
  const data = productFiles.map(f => ({
    displayFileName: f.name,
    originalFileName: "hogehoge.mp3"
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
        { title: "表示ファイル名", field: "displayFileName" },
        {
          title: "オリジナルファイル名",
          field: "originalFileName",
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
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const updated = [...data];
              updated.splice(updated.indexOf(oldData), 1);
              // setData(updated);
            }, 600);
          })
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
  const [productFiles, setProductFiles] = React.useState<ProductFile[]>([]);

  const handleProductFileAddDialog = () => {
    setAddDialogOpen(!addDialogOpen);
  };

  const onProductFileAdded = async (displayFileName: string, file: File) => {
    const task = ProductFile.upload(file);

    task.on(
      storage.TaskEvent.STATE_CHANGED,
      () => {
        //
      },
      e => {
        // tslint:disable-next-line:no-console
        console.error(e);
      },
      async () => {
        const uploadedRef = task.snapshot.ref;
        const newProductFile = await ProductFile.create(
          displayFileName,
          product.ref,
          uploadedRef
        );
        const updatedProduct = await product.addProductFile(newProductFile);

        updatedProduct.getFiles().then(files => setProductFiles(files));
        handleProductFileAddDialog();
      }
    );
  };

  React.useEffect(() => {
    product.getFiles().then(files => {
      setProductFiles(files);
    });
  }, []);

  return (
    <>
      <InnerTable
        productFiles={productFiles}
        onAddButtonClicked={handleProductFileAddDialog}
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
