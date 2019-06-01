import * as React from "react";

import styled, { css } from "styled-components";
import { useDropzone } from "react-dropzone";

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
  ${({ dragActive }: ThumbnailImageProps) =>
    dragActive &&
    css`
      border: 2px #ff0000 solid;
      box-sizing: border-box;

      &::after {
        content: "Drop the files here";
      }
    `}
`;

interface ThumbnailImageProps {
  dragActive: boolean;
}

const ProductImageThumbnailImage = styled.img`
  width: 200px;
  height: 200px;
  ${({ dragActive }: ThumbnailImageProps) =>
    dragActive &&
    css`
      border: 2px #ff0000 solid;
      box-sizing: border-box;
      &::after {
        content: "Drop the files here";
      }
    `}
`;

const ErrorMessage = styled.div`
  color: red;
`;

const MB = 1000 * 1000;

const readAsDataURLWithReader = (file: File): Promise<string> => {
  const reader = new FileReader();

  const promise = new Promise<string>(resolve => {
    reader.onload = () => resolve(reader.result as string);
  });

  reader.readAsDataURL(file);

  return promise;
};

interface ProductImageThumbnailProps {
  src: string | null;
  onChange: (file: File) => void;
}

const ProductImageThumbnail: React.FC<ProductImageThumbnailProps> = ({
  src,
  onChange
}) => {
  const [
    selectedFileErrorMessage,
    setSelectedFileErrorMessage
  ] = React.useState(null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const acceptedFile = acceptedFiles[0];

    if (1 * MB < acceptedFile.size) {
      setSelectedFileErrorMessage("file size should be less than 1MB.");
      return;
    }
    readAsDataURLWithReader(acceptedFile).then(dataUrl => {
      // setSrc(dataUrl);
    });

    onChange(acceptedFile);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*"
  });

  const thumbnail = !!src ? (
    <ProductImageThumbnailImage src={src} dragActive={isDragActive} />
  ) : (
    <ProductImageThumbnailNoImage dragActive={isDragActive} />
  );

  return (
    <>
      {selectedFileErrorMessage && (
        <ErrorMessage>{selectedFileErrorMessage}</ErrorMessage>
      )}
      <div id="hogehoge" {...getRootProps()}>
        <input {...getInputProps()} />
        {thumbnail}
      </div>
    </>
  );
};

interface ProductDetailEditFormProps {
  product: Product;
}
const ProductDetailEditForm: React.FC<ProductDetailEditFormProps> = ({
  product
}) => {
  const [iconUrl, setIconUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    product.getIconUrl().then(url => {
      setIconUrl(url);
    });
  }, []);

  const onNameSubmitted = () => {
    //
  };

  const onDescriptionSubmitted = () => {
    //
  };

  const onIconChanged = (file: File) => {
    product.uploadIconToStorage(file);
  };

  return (
    <Grid container={true}>
      <Box display="flex">
        <Box>
          <ProductImageThumbnail src={iconUrl} onChange={onIconChanged} />
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
        </Box>
      </Box>
    </Grid>
  );
};

export default ProductDetailEditForm;
