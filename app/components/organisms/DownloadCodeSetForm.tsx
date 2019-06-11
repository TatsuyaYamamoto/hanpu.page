import * as React from "react";
const { useEffect, useState } = React;

import MaterialTable, {
  Options as TableOptions,
  Localization as TableLocalization,
  Column as TableColumn
} from "material-table";

import DownloadCodeSetAddDialog from "./DownloadCodeSetAddDialog";

import { saveDownloadCodeSetAsCsvFile } from "../../utils/network";

import { DownloadCodeSet } from "../../domains/DownloadCodeSet";
import { Product } from "../../domains/Product";

const TABLE_OPTIONS: TableOptions = {
  showTitle: false,
  addRowPosition: "first",
  paging: false,
  search: false,
  actionsColumnIndex: -1
};

const TABLE_LOCALIZATION: TableLocalization = {
  header: {
    actions: ""
  },
  body: {
    editRow: {
      deleteText: "けします"
    }
  }
};

const TABLE_COLUMNS: TableColumn[] = [
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
];

interface CodeData {
  id: string;
  length: number;
  createdAt: Date;
  expiredAt: Date;
}

interface DownloadCodeSetFormProps {
  product: Product;
  onAdd: (numberOfCodes: number, expiredAt: Date) => Promise<void>;
}
const DownloadCodeSetForm: React.FC<DownloadCodeSetFormProps> = ({
  product,
  onAdd
}) => {
  const [codeSetList, setCodeSetList] = useState<CodeData[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
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

  const handleAddDialog = () => {
    setAddDialogOpen(!addDialogOpen);
  };

  const onAddRequested = (numberOfCodes: number, expiredAt: Date) => {
    onAdd(numberOfCodes, expiredAt).then(() => {
      handleAddDialog();
    });

    const ref = Product.getDocRef(product.id);
    DownloadCodeSet.create(ref, numberOfCodes, expiredAt).then(set => {
      handleAddDialog();
    });
  };

  const onAddButtonClicked = () => {
    handleAddDialog();
  };

  const onDownloadButtonClicked = (event: any, { id }: CodeData) => {
    DownloadCodeSet.getByProductRef(product.ref).then(downloadCodeSetList => {
      const codeSet = downloadCodeSetList.find(item => item.id === id);

      saveDownloadCodeSetAsCsvFile(codeSet);
    });
  };

  return (
    <>
      <MaterialTable
        options={TABLE_OPTIONS}
        localization={TABLE_LOCALIZATION}
        columns={TABLE_COLUMNS}
        data={codeSetList}
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
