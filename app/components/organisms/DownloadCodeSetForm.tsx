import MaterialTable from "material-table";
import * as React from "react";

import DownloadCodeSetAddDialog from "./DownloadCodeSetAddDialog";

import { DownloadCodeSet } from "../../domains/DownloadCodeSet";
import { Product, ProductFile } from "../../domains/Product";

interface InnerTableProps {
  codeSetList: {
    id: string;
    length: number;
    createdAt: Date;
    expiredAt: Date;
  }[];
  onAddButtonClicked: () => void;
  onDownloadClicked: (id: string) => void;
}

const InnerTable: React.FC<InnerTableProps> = ({
  codeSetList,
  onAddButtonClicked,
  onDownloadClicked
}) => {
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
        { title: "ID", field: "id", type: "string" },
        { title: "発行数", field: "length", type: "numeric" },
        {
          title: "作成日",
          field: "createdAt",
          type: "date"
        },
        {
          title: "有効期限",
          field: "expiredAt",
          type: "date"
        }
      ]}
      data={codeSetList}
      actions={[
        // TODO ダウンロードアイコンの場所の調整。
        // <EDIT><DELETE><DL>ではなくて、<DL><EDIT><DELETE>にする。
        {
          icon: "arrow_downward",
          tooltip: "Download",
          onClick: (event, { id }) => onDownloadClicked(id)
        },
        {
          icon: "add",
          tooltip: "追加",
          isFreeAction: true,
          onClick: onAddButtonClicked
        }
      ]}
    />
  );
};

interface DownloadCodeSetFormProps {
  product: Product;
}
const DownloadCodeSetForm: React.FC<DownloadCodeSetFormProps> = ({
  product
}) => {
  const [codeSetList, setCodeSetList] = React.useState<
    { id: string; length: number; createdAt: Date; expiredAt: Date }[]
  >([]);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);

  const handleAddDialog = () => {
    setAddDialogOpen(!addDialogOpen);
  };

  const onDownloadClicked = (id: string) => {
    // TODO: duplicated logic `onAddRequested`.
    DownloadCodeSet.getByProductRef(product.ref).then(downloadCodeSetList => {
      const codeSet = downloadCodeSetList.find(item => item.id === id);

      let csvContent = "data:text/csv;charset=utf-8,";
      Object.keys(codeSet.codes).forEach(code => {
        csvContent += `${code}\r\n`;
      });

      const a = document.createElement("a");
      a.href = encodeURI(csvContent);
      a.target = "_blank";
      a.download = `download_code_set_${id}.csv`;
      a.click();
    });
  };

  const onAddRequested = (numberOfCodes: number, expiredAt: Date) => {
    const ref = Product.getDocRef(product.id);
    DownloadCodeSet.create(ref, numberOfCodes, expiredAt).then(set => {
      handleAddDialog();
    });
  };

  React.useEffect(() => {
    DownloadCodeSet.getByProductRef(product.ref).then(downloadCodeSetList => {
      setCodeSetList(
        downloadCodeSetList.map(codeSet => {
          return {
            id: codeSet.id,
            length: Object.keys(codeSet.codes).length,
            createdAt: codeSet.createdAt,
            expiredAt: codeSet.expiredAt
          };
        })
      );
    });
  }, []);

  return (
    <>
      DownloadCodeForm
      <InnerTable
        codeSetList={codeSetList}
        onDownloadClicked={onDownloadClicked}
        onAddButtonClicked={handleAddDialog}
      />
      <DownloadCodeSetAddDialog
        open={addDialogOpen}
        handleClose={handleAddDialog}
        onSubmit={onAddRequested}
      />
    </>
  );
};

export default DownloadCodeSetForm;
