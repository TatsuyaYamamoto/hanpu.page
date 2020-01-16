import * as React from "react";
const { useState, useMemo } = React;

import MaterialTable, {
  Options as TableOptions,
  Localization as TableLocalization,
  Column as TableColumn,
  Action,
  EditComponentProps
} from "material-table";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";

import DownloadCodeSetAddDialog from "./DownloadCodeSetAddDialog";

import { saveDownloadCodeSetAsCsvFile } from "../../utils/network";

import {
  DownloadCodeSet,
  DownloadCodeSetDocument
} from "../../domains/DownloadCodeSet";

const DescriptionTextField = styled.div`
  white-space: pre-wrap;
  width: 250px;
`;

const PreviewComponentRender = (rowData: CodeData) => (
  <DescriptionTextField>{rowData.description}</DescriptionTextField>
);

const EditComponent = (props: EditComponentProps) => {
  const codeData: CodeData = props.rowData;

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  };

  return (
    <TextField
      defaultValue={codeData.description}
      multiline={true}
      fullWidth={true}
      onChange={onChangeValue}
    />
  );
};

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
  {
    title: "ID",
    field: "id",
    type: "string",
    editable: "never",
    cellStyle: {
      maxWidth: 200
    }
  },
  {
    title: "発行数",
    field: "length",
    type: "numeric",
    editable: "never",
    cellStyle: {}
  },
  {
    title: "作成日",
    field: "createdAt",
    type: "datetime",
    editable: "never"
  },
  {
    title: "有効期限",
    field: "expiredAt",
    type: "datetime",
    editable: "never"
  },
  {
    title: "Description",
    field: "description",
    render: PreviewComponentRender,
    editComponent: EditComponent
  }
];

interface CodeData {
  id: string;
  length: number;
  createdAt: Date;
  expiredAt: Date;
  description: string | null;
}

interface DownloadCodeSetFormProps {
  downloadCodeSets: DownloadCodeSet[];
  onAdd: (numberOfCodes: number, expiredAt: Date) => Promise<void>;
  onUpdate: (
    codeSetId: string,
    edited: Pick<DownloadCodeSetDocument, "description">
  ) => Promise<void>;
}

const DownloadCodeSetForm: React.FC<DownloadCodeSetFormProps> = ({
  downloadCodeSets,
  onAdd,
  onUpdate
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

  const onRowUpdate = async (newData: CodeData, oldData?: CodeData) => {
    if (!oldData) {
      return;
    }

    if (newData.description === oldData.description) {
      return;
    }

    const { id } = newData;
    const edited: Pick<DownloadCodeSetDocument, "description"> = {
      description: newData.description
    };

    return onUpdate(id, edited);
  };

  const tableData: CodeData[] = useMemo(
    () =>
      downloadCodeSets.map(set => ({
        id: set.id,
        length: Object.keys(set.codes).length,
        createdAt: set.createdAt,
        expiredAt: set.expiredAt,
        description: set.description
      })),
    [downloadCodeSets]
  );

  const actions: Action[] = [
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
  ];

  return (
    <>
      <MaterialTable
        options={TABLE_OPTIONS}
        localization={TABLE_LOCALIZATION}
        columns={TABLE_COLUMNS}
        title={"ダウンロードコード一覧"}
        data={tableData}
        actions={actions}
        editable={{
          onRowUpdate
        }}
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
