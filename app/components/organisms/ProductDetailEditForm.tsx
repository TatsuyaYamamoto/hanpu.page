import * as React from "react";

import styled from "styled-components";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { DownloadCodeSet } from "../../domains/DownloadCodeSet";
import { Product } from "../../domains/Product";

interface IdFieldProps {
  id: string;
}

const IdField: React.FC<IdFieldProps> = ({ id }) => {
  return (
    <TextField
      label={"ID"}
      value={id}
      InputProps={{
        readOnly: true
      }}
    />
  );
};

interface EditableFieldProps {
  label: string;
  defaultValue: string;
  multiline?: boolean;
  onSubmit: (newValue: string) => void;
}
const EditableField: React.FC<EditableFieldProps> = ({
  label,
  defaultValue,
  multiline,
  onSubmit
}) => {
  const [editing, setEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(defaultValue);

  const handleEditingState = () => {
    setEditing(!editing);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const onCancelClicked = () => {
    setEditValue(defaultValue);
    handleEditingState();
  };

  const onUpdateClicked = () => {
    onSubmit(editValue);
  };

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <TextField
          label={label}
          value={editValue}
          multiline={!!multiline}
          onChange={onChange}
          InputProps={{
            readOnly: !editing
          }}
        />
      </Box>

      {!editing && (
        <Box p={1}>
          <Button onClick={handleEditingState}>編集</Button>
        </Box>
      )}
      {editing && (
        <Box>
          <Button variant="outlined" onClick={onUpdateClicked}>
            更新
          </Button>
          <Button variant="outlined" onClick={onCancelClicked}>
            キャンセル
          </Button>
        </Box>
      )}
    </Box>
  );
};

const ProductImageThumbnailNoImage = styled.div`
  width: 200px;
  height: 200px;
  background-color: darkgray;
  &::after {
    content: "No Image";
    color: white;
  }
`;

const ProductImageThumbnailImage = styled.img`
  width: 200px;
  height: 200px;
`;

interface ProductImageThumbnailProps {
  defaultSrc: string | null;
}

const ProductImageThumbnail: React.FC<ProductImageThumbnailProps> = ({
  defaultSrc
}) => {
  const [src, setSrc] = React.useState(defaultSrc);

  if (!src) {
    return <ProductImageThumbnailNoImage />;
  }

  return <ProductImageThumbnailImage />;
};

interface ProductDetailEditFormProps {
  product: Product;
}
const ProductDetailEditForm: React.FC<ProductDetailEditFormProps> = ({
  product
}) => {
  const createDlCodeSet = () => {
    const ref = Product.getDocRef(product.id);
    DownloadCodeSet.create(ref, 2).then(set => {
      //
    });
  };

  const onNameSubmitted = () => {
    //
  };

  const onDescriptionSubmitted = () => {
    //
  };

  return (
    <Grid container={true}>
      <Box display="flex">
        <Box>
          <ProductImageThumbnail defaultSrc={null} />
        </Box>

        <Box>
          <IdField id={product.id} />

          <EditableField
            label={"Name"}
            defaultValue={product.name}
            onSubmit={onNameSubmitted}
          />

          <EditableField
            label={"Description"}
            defaultValue={product.description}
            multiline={true}
            onSubmit={onDescriptionSubmitted}
          />

          <EditableField
            label={"Private note"}
            defaultValue={product.privateNote}
            multiline={true}
            onSubmit={onDescriptionSubmitted}
          />

          <TextField
            label={"created"}
            value={product.createdAt.toDateString()}
          />

          <Box>
            <Button onClick={createDlCodeSet}>Create DLCode Set</Button>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default ProductDetailEditForm;
