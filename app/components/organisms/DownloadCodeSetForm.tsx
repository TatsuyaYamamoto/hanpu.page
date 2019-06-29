import * as React from "react";
const { useState, useMemo } = React;

import MaterialTable, {
  Options as TableOptions,
  Localization as TableLocalization,
  Column as TableColumn
} from "material-table";

import DownloadCodeSetAddDialog from "./DownloadCodeSetAddDialog";

import { saveDownloadCodeSetAsCsvFile } from "../../utils/network";

import { DownloadCodeSet } from "../../domains/DownloadCodeSet";

const TABLE_OPTIONS: TableOptions = {
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
    type: "datetime"
  },
  {
    title: "有効期限",
    field: "expiredAt",
    type: "datetime"
  }
];

interface CodeData {
  id: string;
  length: number;
  createdAt: Date;
  expiredAt: Date;
}

interface DownloadCodeSetFormProps {
  downloadCodeSets: DownloadCodeSet[];
  onAdd: (numberOfCodes: number, expiredAt: Date) => Promise<void>;
}

const DownloadCodeSetForm: React.FC<DownloadCodeSetFormProps> = ({
  downloadCodeSets,
  onAdd
}) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddDialog = () => {
    setAddDialogOpen(!addDialogOpen);
  };

  const onAddRequested = (numberOfCodes: number, expiredAt: Date) => {
    onAdd(numberOfCodes, expiredAt).then(() => {
      handleAddDialog();
    });
  };

  const onAddButtonClicked = () => {
    handleAddDialog();
  };

  const onDownloadButtonClicked = (_: any, selected: CodeData) => {
    const codeSet = downloadCodeSets.find(({ id }) => id === selected.id);

    if (!codeSet) {
      throw new Error("unexpected error. could not find download code set.");
    }

    saveDownloadCodeSetAsCsvFile(codeSet);
  };

  const tableData: CodeData[] = useMemo(
    () =>
      downloadCodeSets.map(set => ({
        id: set.id,
        length: Object.keys(set.codes).length,
        createdAt: set.createdAt,
        expiredAt: set.expiredAt
      })),
    [downloadCodeSets]
  );

  return (
    <>
      <MaterialTable
        options={TABLE_OPTIONS}
        localization={TABLE_LOCALIZATION}
        columns={TABLE_COLUMNS}
        title={"ダウンロードコード一覧"}
        data={tableData}
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
